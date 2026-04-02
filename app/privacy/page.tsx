"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-navy text-white">
        <div className="px-[5%] py-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Retour</span>
            </Link>
            <div className="flex-1">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-navy-light rounded-lg flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                    <path d="M5 14c0-1 .7-2 2-2h3l2 2 2-2h3c1.3 0 2 1 2 2v1c0 1.3-.7 2-2 2H7c-1.3 0-2-.7-2-2v-1z" fill="#f47920" />
                    <circle cx="8" cy="7" r="2.5" fill="white" opacity=".85" />
                    <circle cx="16" cy="7" r="2.5" fill="white" opacity=".85" />
                  </svg>
                </div>
                <span className="font-serif text-lg font-bold">
                  Moyawim<span className="text-orange">.ma</span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="px-[5%] py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-serif text-3xl md:text-4xl font-extrabold text-navy mb-4">
            Politique de Confidentialite
          </h1>
          <p className="text-muted-foreground mb-8">
            Derniere mise a jour : Janvier 2025
          </p>

          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="font-serif text-xl font-bold text-navy mb-4">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                Moyawim.ma s&apos;engage a proteger la vie privee de ses utilisateurs. Cette politique explique comment nous collectons, utilisons et protegeons vos donnees personnelles conformement a la loi marocaine 09-08 relative a la protection des personnes physiques a l&apos;egard du traitement des donnees a caractere personnel.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-xl font-bold text-navy mb-4">2. Donnees Collectees</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Nous collectons les types de donnees suivants :
              </p>
              
              <h3 className="font-semibold text-navy mb-2">Donnees d&apos;identification :</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4">
                <li>Nom et prenom</li>
                <li>Adresse email</li>
                <li>Numero de telephone</li>
                <li>Photo de profil (optionnel)</li>
                <li>Numero de CNIE (pour verification)</li>
              </ul>

              <h3 className="font-semibold text-navy mb-2">Donnees de localisation :</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4">
                <li>Ville de residence</li>
                <li>Zone de travail preferee</li>
              </ul>

              <h3 className="font-semibold text-navy mb-2">Donnees d&apos;utilisation :</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Historique des taches publiees/realisees</li>
                <li>Messages echanges sur la plateforme</li>
                <li>Avis et evaluations</li>
                <li>Donnees de navigation</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-xl font-bold text-navy mb-4">3. Utilisation des Donnees</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Vos donnees sont utilisees pour :
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Creer et gerer votre compte utilisateur</li>
                <li>Faciliter la mise en relation entre Employeurs et Travailleurs</li>
                <li>Traiter les paiements et transactions</li>
                <li>Verifier l&apos;identite des utilisateurs</li>
                <li>Vous envoyer des notifications relatives a vos taches</li>
                <li>Ameliorer nos services et l&apos;experience utilisateur</li>
                <li>Prevenir les fraudes et assurer la securite</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-xl font-bold text-navy mb-4">4. Partage des Donnees</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Nous ne vendons jamais vos donnees personnelles. Vos informations peuvent etre partagees avec :
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Les autres utilisateurs de la plateforme (informations de profil public)</li>
                <li>Nos prestataires de services (hebergement, paiement)</li>
                <li>Les autorites competentes en cas d&apos;obligation legale</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-xl font-bold text-navy mb-4">5. Securite des Donnees</h2>
              <p className="text-muted-foreground leading-relaxed">
                Nous mettons en oeuvre des mesures techniques et organisationnelles appropriees pour proteger vos donnees : chiffrement SSL, acces restreint aux donnees, sauvegardes regulieres, et surveillance continue.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-xl font-bold text-navy mb-4">6. Conservation des Donnees</h2>
              <p className="text-muted-foreground leading-relaxed">
                Vos donnees sont conservees tant que votre compte est actif. Apres suppression du compte, certaines donnees peuvent etre conservees pendant 5 ans pour des raisons legales et comptables.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-xl font-bold text-navy mb-4">7. Vos Droits</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Conformement a la loi 09-08, vous disposez des droits suivants :
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Droit d&apos;acces :</strong> obtenir une copie de vos donnees</li>
                <li><strong>Droit de rectification :</strong> corriger les donnees inexactes</li>
                <li><strong>Droit d&apos;opposition :</strong> vous opposer au traitement de vos donnees</li>
                <li><strong>Droit a l&apos;effacement :</strong> demander la suppression de vos donnees</li>
                <li><strong>Droit a la portabilite :</strong> recevoir vos donnees dans un format structure</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-xl font-bold text-navy mb-4">8. Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                Nous utilisons des cookies pour ameliorer votre experience de navigation. Vous pouvez gerer vos preferences de cookies dans les parametres de votre navigateur.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-xl font-bold text-navy mb-4">9. CNDP</h2>
              <p className="text-muted-foreground leading-relaxed">
                Moyawim.ma est enregistre aupres de la Commission Nationale de controle de la protection des Donnees a caractere Personnel (CNDP) du Royaume du Maroc.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-xl font-bold text-navy mb-4">10. Contact</h2>
              <p className="text-muted-foreground leading-relaxed">
                Pour exercer vos droits ou pour toute question concernant cette politique, contactez notre Delegue a la Protection des Donnees :<br />
                <a href="mailto:privacy@moyawim.ma" className="text-orange hover:underline">privacy@moyawim.ma</a>
              </p>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t py-6 px-[5%]">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 Moyawim.ma - ENCG Meknes
          </p>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/terms" className="text-muted-foreground hover:text-orange">
              Conditions generales
            </Link>
            <Link href="/help" className="text-muted-foreground hover:text-orange">
              Aide
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
