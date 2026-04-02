"use client"

import { useEffect, useState, useCallback } from "react"
import {
  db,
  collection,
  addDoc,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  onSnapshot,
  increment,
} from "./firebase"
import { useAuth } from "./auth-context"
import type { Task, Offer, Review, Message, Chat, WorkerData, Notification } from "./types"

// ============ TASKS ============

// Post a new task
export function usePostTask() {
  const { user, userData } = useAuth()

  const postTask = async (
    data: Omit<Task, "id" | "userId" | "userName" | "userAvatar" | "status" | "createdAt" | "updatedAt" | "offersCount" | "viewsCount" | "featured" | "urgent">
  ) => {
    if (!user) throw new Error("Non connecte")
    const docRef = await addDoc(collection(db, "tasks"), {
      ...data,
      userId: user.uid,
      userName: userData?.name || "Anonyme",
      userAvatar: userData?.avatar || null,
      status: "open",
      offersCount: 0,
      viewsCount: 0,
      featured: false,
      urgent: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    
    // Update user's tasks posted count
    await updateDoc(doc(db, "users", user.uid), {
      tasksPosted: increment(1),
    })
    
    return docRef
  }

  return { postTask }
}

// Get a single task
export function useTask(taskId: string | null) {
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!taskId) {
      setTask(null)
      setLoading(false)
      return
    }

    const unsub = onSnapshot(doc(db, "tasks", taskId), (snap) => {
      if (snap.exists()) {
        setTask({ id: snap.id, ...snap.data() } as Task)
      } else {
        setTask(null)
      }
      setLoading(false)
    })

    return () => unsub()
  }, [taskId])

  return { task, loading }
}

// Increment task views
export async function incrementTaskViews(taskId: string) {
  await updateDoc(doc(db, "tasks", taskId), {
    viewsCount: increment(1),
  })
}

// Listen to my tasks (employer)
export function useMyTasks() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setTasks([])
      setLoading(false)
      return
    }

    const q = query(
      collection(db, "tasks"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    )

    const unsub = onSnapshot(q, (snap) => {
      setTasks(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Task)))
      setLoading(false)
    })

    return () => unsub()
  }, [user])

  return { tasks, loading }
}

// Browse all open tasks with filters
export function useBrowseTasks(filters?: {
  category?: string
  city?: string
  minBudget?: number
  maxBudget?: number
  remote?: boolean
}) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let q = query(
      collection(db, "tasks"),
      where("status", "==", "open"),
      orderBy("createdAt", "desc"),
      limit(100)
    )

    const unsub = onSnapshot(q, (snap) => {
      let results = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Task))
      
      // Apply client-side filters
      if (filters?.category) {
        results = results.filter(t => t.category === filters.category)
      }
      if (filters?.city) {
        results = results.filter(t => t.location?.city === filters.city)
      }
      if (filters?.minBudget) {
        results = results.filter(t => t.budget?.amount >= filters.minBudget!)
      }
      if (filters?.maxBudget) {
        results = results.filter(t => t.budget?.amount <= filters.maxBudget!)
      }
      if (filters?.remote) {
        results = results.filter(t => t.location?.remote === true)
      }
      
      setTasks(results)
      setLoading(false)
    })

    return () => unsub()
  }, [filters?.category, filters?.city, filters?.minBudget, filters?.maxBudget, filters?.remote])

  return { tasks, loading }
}

// Update task status
export async function updateTaskStatus(taskId: string, status: Task["status"], assignedTo?: string, assignedName?: string) {
  await updateDoc(doc(db, "tasks", taskId), {
    status,
    ...(assignedTo && { assignedTo }),
    ...(assignedName && { assignedName }),
    updatedAt: serverTimestamp(),
  })
}

// Delete task
export async function deleteTask(taskId: string) {
  await deleteDoc(doc(db, "tasks", taskId))
}

// ============ OFFERS ============

// Make an offer
export function useMakeOffer() {
  const { user, userData } = useAuth()

  const makeOffer = async (taskId: string, taskTitle: string, amount: number, message: string, estimatedDuration?: string) => {
    if (!user) throw new Error("Non connecte")
    
    // Check if already made an offer
    const existingOffersQuery = query(
      collection(db, "offers"),
      where("taskId", "==", taskId),
      where("workerId", "==", user.uid)
    )
    const existing = await getDocs(existingOffersQuery)
    if (!existing.empty) throw new Error("Vous avez deja fait une offre")

    await addDoc(collection(db, "offers"), {
      taskId,
      taskTitle,
      workerId: user.uid,
      workerName: userData?.name || "Anonyme",
      workerAvatar: userData?.avatar || null,
      workerRating: userData?.rating || 0,
      workerReviewsCount: userData?.reviewsCount || 0,
      workerCompletionRate: (userData as WorkerData)?.completionRate || 100,
      amount,
      message,
      estimatedDuration,
      status: "pending",
      createdAt: serverTimestamp(),
    })

    // Increment task offers count
    await updateDoc(doc(db, "tasks", taskId), {
      offersCount: increment(1),
    })

    // Create notification for task owner
    const taskDoc = await getDoc(doc(db, "tasks", taskId))
    if (taskDoc.exists()) {
      const taskData = taskDoc.data()
      await addDoc(collection(db, "notifications"), {
        userId: taskData.userId,
        type: "offer",
        title: "Nouvelle offre",
        body: `${userData?.name || "Quelqu'un"} a fait une offre de ${amount} DH`,
        link: `/dashboard/tasks/${taskId}`,
        read: false,
        createdAt: serverTimestamp(),
      })
    }
  }

  return { makeOffer }
}

// Get offers for a task
export function useTaskOffers(taskId: string | null) {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!taskId) {
      setOffers([])
      setLoading(false)
      return
    }

    const q = query(
      collection(db, "offers"),
      where("taskId", "==", taskId),
      orderBy("createdAt", "desc")
    )

    const unsub = onSnapshot(q, (snap) => {
      setOffers(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Offer)))
      setLoading(false)
    })

    return () => unsub()
  }, [taskId])

  return { offers, loading }
}

// Get my offers (worker)
export function useMyOffers() {
  const { user } = useAuth()
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setOffers([])
      setLoading(false)
      return
    }

    const q = query(
      collection(db, "offers"),
      where("workerId", "==", user.uid),
      orderBy("createdAt", "desc")
    )

    const unsub = onSnapshot(q, (snap) => {
      setOffers(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Offer)))
      setLoading(false)
    })

    return () => unsub()
  }, [user])

  return { offers, loading }
}

// Accept an offer
export async function acceptOffer(offerId: string, taskId: string, workerId: string, workerName: string) {
  // Update offer status
  await updateDoc(doc(db, "offers", offerId), {
    status: "accepted",
  })

  // Reject other offers
  const otherOffersQuery = query(
    collection(db, "offers"),
    where("taskId", "==", taskId),
    where("status", "==", "pending")
  )
  const otherOffers = await getDocs(otherOffersQuery)
  for (const offerDoc of otherOffers.docs) {
    if (offerDoc.id !== offerId) {
      await updateDoc(doc(db, "offers", offerDoc.id), { status: "rejected" })
    }
  }

  // Update task
  await updateTaskStatus(taskId, "assigned", workerId, workerName)

  // Notify worker
  await addDoc(collection(db, "notifications"), {
    userId: workerId,
    type: "offer",
    title: "Offre acceptee !",
    body: "Votre offre a ete acceptee. Contactez l'employeur pour commencer.",
    link: `/dashboard/tasks/${taskId}`,
    read: false,
    createdAt: serverTimestamp(),
  })
}

// Withdraw offer
export async function withdrawOffer(offerId: string, taskId: string) {
  await updateDoc(doc(db, "offers", offerId), {
    status: "withdrawn",
  })
  await updateDoc(doc(db, "tasks", taskId), {
    offersCount: increment(-1),
  })
}

// ============ REVIEWS ============

// Add a review
export function useAddReview() {
  const { user, userData } = useAuth()

  const addReview = async (data: {
    taskId: string
    taskTitle: string
    toId: string
    toName: string
    rating: number
    comment: string
    aspects?: Review["aspects"]
  }) => {
    if (!user) throw new Error("Non connecte")

    await addDoc(collection(db, "reviews"), {
      ...data,
      fromId: user.uid,
      fromName: userData?.name || "Anonyme",
      fromAvatar: userData?.avatar || null,
      createdAt: serverTimestamp(),
    })

    // Update user's rating
    const reviewsQuery = query(collection(db, "reviews"), where("toId", "==", data.toId))
    const reviews = await getDocs(reviewsQuery)
    const totalRating = reviews.docs.reduce((sum, doc) => sum + (doc.data().rating || 0), data.rating)
    const avgRating = totalRating / (reviews.docs.length + 1)

    await updateDoc(doc(db, "users", data.toId), {
      rating: Math.round(avgRating * 10) / 10,
      reviewsCount: increment(1),
    })

    // Notify user
    await addDoc(collection(db, "notifications"), {
      userId: data.toId,
      type: "review",
      title: "Nouvel avis",
      body: `${userData?.name} vous a laisse un avis ${data.rating}/5`,
      link: `/profile/${data.toId}`,
      read: false,
      createdAt: serverTimestamp(),
    })
  }

  return { addReview }
}

// Get reviews for a user
export function useUserReviews(userId: string | null) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setReviews([])
      setLoading(false)
      return
    }

    const q = query(
      collection(db, "reviews"),
      where("toId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(50)
    )

    const unsub = onSnapshot(q, (snap) => {
      setReviews(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Review)))
      setLoading(false)
    })

    return () => unsub()
  }, [userId])

  return { reviews, loading }
}

// ============ MESSAGES & CHATS ============

// Send message
export function useSendMessage() {
  const { user, userData } = useAuth()

  const sendMessage = async (toId: string, toName: string, text: string, taskId?: string, taskTitle?: string) => {
    if (!user) throw new Error("Non connecte")
    const chatId = [user.uid, toId].sort().join("_")

    // Create or update chat
    const chatRef = doc(db, "chats", chatId)
    const chatDoc = await getDoc(chatRef)
    
    if (!chatDoc.exists()) {
      await setDoc(chatRef, {
        participants: [user.uid, toId],
        participantNames: {
          [user.uid]: userData?.name || "Anonyme",
          [toId]: toName,
        },
        participantAvatars: {
          [user.uid]: userData?.avatar || null,
          [toId]: null,
        },
        lastMessage: text,
        lastMessageAt: serverTimestamp(),
        unreadCount: { [user.uid]: 0, [toId]: 1 },
        ...(taskId && { taskId, taskTitle }),
      })
    } else {
      await updateDoc(chatRef, {
        lastMessage: text,
        lastMessageAt: serverTimestamp(),
        [`unreadCount.${toId}`]: increment(1),
      })
    }

    // Add message
    await addDoc(collection(db, "messages"), {
      chatId,
      text,
      fromId: user.uid,
      fromName: userData?.name || "Anonyme",
      fromAvatar: userData?.avatar || null,
      toId,
      read: false,
      createdAt: serverTimestamp(),
    })

    // Notify recipient
    await addDoc(collection(db, "notifications"), {
      userId: toId,
      type: "message",
      title: "Nouveau message",
      body: `${userData?.name}: ${text.substring(0, 50)}${text.length > 50 ? "..." : ""}`,
      link: `/dashboard/messages`,
      read: false,
      createdAt: serverTimestamp(),
    })
  }

  return { sendMessage }
}

// Get chats
export function useChats() {
  const { user } = useAuth()
  const [chats, setChats] = useState<Chat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setChats([])
      setLoading(false)
      return
    }

    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", user.uid),
      orderBy("lastMessageAt", "desc")
    )

    const unsub = onSnapshot(q, (snap) => {
      setChats(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Chat)))
      setLoading(false)
    })

    return () => unsub()
  }, [user])

  return { chats, loading }
}

// Get messages for a chat
export function useMessages(chatId: string | null) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!chatId) {
      setMessages([])
      setLoading(false)
      return
    }

    const q = query(
      collection(db, "messages"),
      where("chatId", "==", chatId),
      orderBy("createdAt", "asc")
    )

    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Message)))
      setLoading(false)
    })

    return () => unsub()
  }, [chatId])

  return { messages, loading }
}

// Mark chat as read
export async function markChatAsRead(chatId: string, userId: string) {
  await updateDoc(doc(db, "chats", chatId), {
    [`unreadCount.${userId}`]: 0,
  })
}

// ============ WORKERS ============

// Browse workers
export function useWorkers(filters?: {
  skill?: string
  city?: string
  minRating?: number
  available?: boolean
}) {
  const [workers, setWorkers] = useState<(WorkerData & { id: string })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(
      collection(db, "workers"),
      orderBy("rating", "desc"),
      limit(100)
    )

    const unsub = onSnapshot(q, (snap) => {
      let results = snap.docs.map((d) => ({ id: d.id, ...d.data() } as WorkerData & { id: string }))
      
      // Apply filters
      if (filters?.skill) {
        results = results.filter(w => w.skills?.some(s => s.toLowerCase().includes(filters.skill!.toLowerCase())))
      }
      if (filters?.city) {
        results = results.filter(w => w.city === filters.city)
      }
      if (filters?.minRating) {
        results = results.filter(w => w.rating >= filters.minRating!)
      }
      if (filters?.available !== undefined) {
        results = results.filter(w => w.available === filters.available)
      }
      
      setWorkers(results)
      setLoading(false)
    })

    return () => unsub()
  }, [filters?.skill, filters?.city, filters?.minRating, filters?.available])

  return { workers, loading }
}

// Get worker profile
export function useWorkerProfile(workerId?: string) {
  const { user } = useAuth()
  const id = workerId || user?.uid
  const [profile, setProfile] = useState<WorkerData | null>(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = useCallback(async () => {
    if (!id) {
      setProfile(null)
      setLoading(false)
      return
    }

    try {
      const d = await getDoc(doc(db, "workers", id))
      if (d.exists()) {
        setProfile(d.data() as WorkerData)
      }
    } catch {
      // Ignore
    }
    setLoading(false)
  }, [id])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  return { profile, loading, refreshProfile: loadProfile }
}

// Save worker profile
export function useSaveWorkerProfile() {
  const { user } = useAuth()

  const saveWorker = async (data: Partial<WorkerData>) => {
    if (!user) throw new Error("Non connecte")
    await setDoc(doc(db, "workers", user.uid), { ...data, updatedAt: serverTimestamp(), lastActive: serverTimestamp() }, { merge: true })
    await updateDoc(doc(db, "users", user.uid), {
      name: data.name,
      phone: data.phone || "",
      city: data.city || "",
      updatedAt: serverTimestamp(),
    })
  }

  return { saveWorker }
}

// Save employer profile
export function useSaveEmployerProfile() {
  const { user } = useAuth()

  const saveEmployer = async (data: { name: string; phone: string; city: string; bio?: string }) => {
    if (!user) throw new Error("Non connecte")
    await updateDoc(doc(db, "users", user.uid), {
      ...data,
      updatedAt: serverTimestamp(),
    })
  }

  return { saveEmployer }
}

// ============ NOTIFICATIONS ============

// Get notifications
export function useNotifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setNotifications([])
      setUnreadCount(0)
      setLoading(false)
      return
    }

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(50)
    )

    const unsub = onSnapshot(q, (snap) => {
      const notifs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Notification))
      setNotifications(notifs)
      setUnreadCount(notifs.filter(n => !n.read).length)
      setLoading(false)
    })

    return () => unsub()
  }, [user])

  return { notifications, unreadCount, loading }
}

// Mark notification as read
export async function markNotificationRead(notificationId: string) {
  await updateDoc(doc(db, "notifications", notificationId), { read: true })
}

// Mark all notifications as read
export async function markAllNotificationsRead(userId: string) {
  const q = query(
    collection(db, "notifications"),
    where("userId", "==", userId),
    where("read", "==", false)
  )
  const snap = await getDocs(q)
  for (const d of snap.docs) {
    await updateDoc(doc(db, "notifications", d.id), { read: true })
  }
}

// ============ LEGACY EXPORTS FOR COMPATIBILITY ============

export const usePostMission = usePostTask
export const useAllMissions = () => useBrowseTasks()
export const useMyMissions = useMyTasks
export const useApplyToMission = () => {
  const { makeOffer } = useMakeOffer()
  return {
    apply: async (missionId: string) => {
      await makeOffer(missionId, "", 0, "Je souhaite realiser cette mission")
    }
  }
}
export const useMyApplications = useMyOffers
