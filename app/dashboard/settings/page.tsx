"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { 
  Bell, Lock, User, Globe, Shield, Trash2, 
  Mail, Phone, Eye, EyeOff, ChevronRight, LogOut,
  Sun, Moon, Smartphone, Volume2, VolumeX
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useAuth } from "@/lib/auth-context"

export default function SettingsPage() {
  const { user, userData, signOut } = useAuth()
  const router = useRouter()
  
  // Notification settings
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [pushNotifs, setPushNotifs] = useState(true)
  const [smsNotifs, setSmsNotifs] = useState(false)
  const [newOfferNotif, setNewOfferNotif] = useState(true)
  const [messageNotif, setMessageNotif] = useState(true)
  const [reviewNotif, setReviewNotif] = useState(true)
  const [marketingNotif, setMarketingNotif] = useState(false)
  
  // Privacy settings
  const [profileVisible, setProfileVisible] = useState(true)
  const [showOnlineStatus, setShowOnlineStatus] = useState(true)
  const [showLastActive, setShowLastActive] = useState(true)
  
  // Password change
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPasswords, setShowPasswords] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  
  const [language, setLanguage] = useState("fr")
  
  const handleLogout = async () => {
    await signOut()
    toast.info("Deconnecte")
    router.push("/")
  }
  
  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Remplissez tous les champs")
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas")
      return
    }
    if (newPassword.length < 6) {
      toast.error("Le mot de passe doit faire au moins 6 caracteres")
      return
    }
    
    setChangingPassword(true)
    try {
      // TODO: Implement password change with Firebase
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success("Mot de passe modifie avec succes")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      toast.error("Erreur lors du changement de mot de passe")
    } finally {
      setChangingPassword(false)
    }
  }
  
  const handleDeleteAccount = async () => {
    try {
      // TODO: Implement account deletion
      toast.success("Compte supprime")
      router.push("/")
    } catch (error) {
      toast.error("Erreur lors de la suppression")
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-2xl lg:text-3xl font-extrabold text-navy mb-2">
            Parametres
          </h1>
          <p className="text-muted-foreground">
            Gerez vos preferences de compte et de confidentialite.
          </p>
        </div>

        <div className="space-y-6">
          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="w-5 h-5" />
                Informations du compte
              </CardTitle>
              <CardDescription>Vos informations de connexion</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
                <Badge variant="secondary" className="bg-success/10 text-success">
                  Verifie
                </Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between py-2">
                <div>
                  <Label className="text-sm font-medium">Telephone</Label>
                  <p className="text-sm text-muted-foreground">{userData?.phone || "Non renseigne"}</p>
                </div>
                <Button variant="outline" size="sm">
                  Modifier
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between py-2">
                <div>
                  <Label className="text-sm font-medium">Type de compte</Label>
                  <p className="text-sm text-muted-foreground">
                    {userData?.role === "worker" ? "Travailleur" : "Employeur"}
                  </p>
                </div>
                <Badge variant="outline">
                  {userData?.role === "worker" ? "Pro" : "Standard"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Password */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Lock className="w-5 h-5" />
                Securite
              </CardTitle>
              <CardDescription>Modifiez votre mot de passe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Mot de passe actuel</Label>
                <div className="relative">
                  <Input
                    type={showPasswords ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Votre mot de passe actuel"
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nouveau mot de passe</Label>
                  <Input
                    type={showPasswords ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 caracteres"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Confirmer le mot de passe</Label>
                  <Input
                    type={showPasswords ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmez le mot de passe"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={showPasswords}
                  onCheckedChange={setShowPasswords}
                  id="show-passwords"
                />
                <Label htmlFor="show-passwords" className="text-sm text-muted-foreground">
                  Afficher les mots de passe
                </Label>
              </div>
              <Button 
                onClick={handlePasswordChange} 
                disabled={changingPassword}
                className="bg-navy hover:bg-orange"
              >
                {changingPassword ? "Modification..." : "Changer le mot de passe"}
              </Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Bell className="w-5 h-5" />
                Notifications
              </CardTitle>
              <CardDescription>Choisissez comment vous souhaitez etre notifie</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Channels */}
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 block">
                  Canaux de notification
                </Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Notifications par email</span>
                    </div>
                    <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Notifications push</span>
                    </div>
                    <Switch checked={pushNotifs} onCheckedChange={setPushNotifs} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Notifications SMS</span>
                    </div>
                    <Switch checked={smsNotifs} onCheckedChange={setSmsNotifs} />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Types */}
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 block">
                  Types de notifications
                </Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Nouvelles offres recues</span>
                    <Switch checked={newOfferNotif} onCheckedChange={setNewOfferNotif} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Nouveaux messages</span>
                    <Switch checked={messageNotif} onCheckedChange={setMessageNotif} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Avis recus</span>
                    <Switch checked={reviewNotif} onCheckedChange={setReviewNotif} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Emails marketing et promotions</span>
                    <Switch checked={marketingNotif} onCheckedChange={setMarketingNotif} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="w-5 h-5" />
                Confidentialite
              </CardTitle>
              <CardDescription>Controlez la visibilite de votre profil</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium">Profil visible publiquement</span>
                  <p className="text-xs text-muted-foreground">Les autres utilisateurs peuvent voir votre profil</p>
                </div>
                <Switch checked={profileVisible} onCheckedChange={setProfileVisible} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium">Afficher le statut en ligne</span>
                  <p className="text-xs text-muted-foreground">Les autres voient quand vous etes connecte</p>
                </div>
                <Switch checked={showOnlineStatus} onCheckedChange={setShowOnlineStatus} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium">Afficher la derniere activite</span>
                  <p className="text-xs text-muted-foreground">Les autres voient quand vous etiez actif</p>
                </div>
                <Switch checked={showLastActive} onCheckedChange={setShowLastActive} />
              </div>
            </CardContent>
          </Card>

          {/* Language */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Globe className="w-5 h-5" />
                Langue et region
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label>Langue de l&apos;interface</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Francais</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base text-destructive">
                <Trash2 className="w-5 h-5" />
                Zone de danger
              </CardTitle>
              <CardDescription>Actions irreversibles sur votre compte</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium">Deconnexion</span>
                  <p className="text-xs text-muted-foreground">Se deconnecter de tous les appareils</p>
                </div>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Deconnexion
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-destructive">Supprimer le compte</span>
                  <p className="text-xs text-muted-foreground">Cette action est irreversible</p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Supprimer votre compte ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action est irreversible. Toutes vos donnees, taches, messages et avis seront definitivement supprimes.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDeleteAccount}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Supprimer definitivement
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
