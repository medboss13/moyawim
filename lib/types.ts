import type { Timestamp } from "firebase/firestore"

export type UserRole = "employer" | "worker"

export type TaskStatus = "open" | "assigned" | "in_progress" | "completed" | "cancelled"
export type OfferStatus = "pending" | "accepted" | "rejected" | "withdrawn"
export type PaymentStatus = "pending" | "escrow" | "released" | "refunded"

export interface UserData {
  name: string
  email: string
  role: UserRole
  phone: string
  city: string
  avatar?: string
  bio?: string
  createdAt: Timestamp | null
  verified: boolean
  rating: number
  reviewsCount: number
  tasksCompleted: number
  tasksPosted: number
  totalEarned: number
  totalSpent: number
  responseRate: number
  completionRate: number
  badges: string[]
}

export interface WorkerData extends UserData {
  skills: string[]
  hourlyRate: number
  dailyRate: number
  available: boolean
  exp: number
  portfolio: string[]
  certifications: string[]
  languages: string[]
  radius: number
  lastActive: Timestamp | null
}

export interface Category {
  id: string
  name: string
  nameAr: string
  icon: string
  subcategories: string[]
  color: string
}

export interface Task {
  id: string
  title: string
  description: string
  category: string
  subcategory?: string
  location: {
    city: string
    address: string
    remote: boolean
  }
  budget: {
    type: "fixed" | "hourly" | "daily"
    amount: number
    negotiable: boolean
  }
  dates: {
    flexible: boolean
    startDate?: string
    endDate?: string
    deadline?: string
  }
  status: TaskStatus
  userId: string
  userName: string
  userAvatar?: string
  assignedTo?: string
  assignedName?: string
  offersCount: number
  viewsCount: number
  createdAt: Timestamp | null
  updatedAt: Timestamp | null
  images: string[]
  requirements?: string[]
  featured: boolean
  urgent: boolean
}

export interface Offer {
  id: string
  taskId: string
  taskTitle: string
  workerId: string
  workerName: string
  workerAvatar?: string
  workerRating: number
  workerReviewsCount: number
  workerCompletionRate: number
  amount: number
  message: string
  estimatedDuration?: string
  status: OfferStatus
  createdAt: Timestamp | null
}

export interface Payment {
  id: string
  taskId: string
  offerId: string
  payerId: string
  payeeId: string
  amount: number
  fee: number
  total: number
  status: PaymentStatus
  escrowedAt?: Timestamp | null
  releasedAt?: Timestamp | null
  createdAt: Timestamp | null
}

export interface Review {
  id: string
  taskId: string
  taskTitle: string
  fromId: string
  fromName: string
  fromAvatar?: string
  toId: string
  toName: string
  rating: number
  comment: string
  aspects: {
    communication?: number
    quality?: number
    punctuality?: number
    professionalism?: number
  }
  createdAt: Timestamp | null
}

export interface Message {
  id: string
  chatId: string
  text: string
  fromId: string
  fromName: string
  fromAvatar?: string
  toId: string
  read: boolean
  createdAt: Timestamp | null
}

export interface Chat {
  id: string
  participants: string[]
  participantNames: Record<string, string>
  participantAvatars: Record<string, string>
  lastMessage: string
  lastMessageAt: Timestamp | null
  unreadCount: Record<string, number>
  taskId?: string
  taskTitle?: string
}

export interface Notification {
  id: string
  userId: string
  type: "offer" | "message" | "review" | "payment" | "task_update" | "system"
  title: string
  body: string
  link?: string
  read: boolean
  createdAt: Timestamp | null
}

// Categories available on the platform
export const CATEGORIES: Category[] = [
  {
    id: "construction",
    name: "BTP & Construction",
    nameAr: "البناء والتشييد",
    icon: "HardHat",
    color: "#f59e0b",
    subcategories: ["Maconnerie", "Plomberie", "Electricite", "Peinture", "Carrelage", "Menuiserie", "Soudure", "Renovation"],
  },
  {
    id: "cleaning",
    name: "Nettoyage & Menage",
    nameAr: "التنظيف والترتيب",
    icon: "Sparkles",
    color: "#06b6d4",
    subcategories: ["Menage maison", "Nettoyage bureaux", "Lavage vitres", "Repassage", "Nettoyage voiture"],
  },
  {
    id: "gardening",
    name: "Jardinage",
    nameAr: "البستنة",
    icon: "Flower2",
    color: "#22c55e",
    subcategories: ["Entretien jardin", "Taille haies", "Tonte pelouse", "Arrosage", "Amenagement"],
  },
  {
    id: "moving",
    name: "Demenagement",
    nameAr: "النقل",
    icon: "Truck",
    color: "#8b5cf6",
    subcategories: ["Demenagement complet", "Transport meubles", "Montage meubles", "Emballage"],
  },
  {
    id: "delivery",
    name: "Livraison & Courses",
    nameAr: "التوصيل",
    icon: "Package",
    color: "#ec4899",
    subcategories: ["Livraison colis", "Courses marche", "Livraison documents", "Achats"],
  },
  {
    id: "tech",
    name: "Tech & Informatique",
    nameAr: "التكنولوجيا",
    icon: "Laptop",
    color: "#3b82f6",
    subcategories: ["Reparation PC", "Installation logiciel", "Reseau", "Site web", "Support technique"],
  },
  {
    id: "events",
    name: "Evenementiel",
    nameAr: "المناسبات",
    icon: "PartyPopper",
    color: "#f43f5e",
    subcategories: ["Service traiteur", "Photo/Video", "Animation", "Decoration", "DJ"],
  },
  {
    id: "care",
    name: "Garde & Soins",
    nameAr: "الرعاية",
    icon: "Heart",
    color: "#ef4444",
    subcategories: ["Garde enfants", "Aide seniors", "Garde animaux", "Soins a domicile"],
  },
  {
    id: "auto",
    name: "Auto & Moto",
    nameAr: "السيارات",
    icon: "Car",
    color: "#64748b",
    subcategories: ["Mecanique", "Lavage auto", "Depannage", "Transport"],
  },
  {
    id: "other",
    name: "Autres Services",
    nameAr: "خدمات اخرى",
    icon: "MoreHorizontal",
    color: "#a855f7",
    subcategories: ["Cours particuliers", "Traduction", "Couture", "Reparations diverses"],
  },
]

export const MOROCCAN_CITIES = [
  "Casablanca", "Rabat", "Marrakech", "Fes", "Tanger", "Agadir", "Meknes",
  "Oujda", "Kenitra", "Tetouan", "Safi", "Mohammedia", "El Jadida", "Beni Mellal",
  "Nador", "Taza", "Settat", "Berrechid", "Khouribga", "Laayoune"
]
