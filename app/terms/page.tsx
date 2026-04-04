"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
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
            Conditions Generales d&apos;Utilisation
          </h1>
          <p className="text-muted-foreground mb-8">
            Derniere mise a jour : Janvier 2025
          </p>

          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="font-serif text-xl font-bold text-navy mb-4">1. Presentation du Service</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Moyawim.ma est une plateforme en ligne de mise en relation entre des particuliers ou entreprises (les &quot;Employeurs&quot;) souhaitant faire realiser des missions ou services, et des prestataires independants (les &quot;Travailleurs&quot;) proposant leurs competences.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                La plateforme est exploitee dans le cadre d&apos;un projet academique par des etudiants de l&apos;ENCG Meknes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-xl font-bold text-navy mb-4">2. Inscription et Compte</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Pour utiliser les services de Moyawim.ma, vous devez :
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>Etre age d&apos;au moins 18 ans</li>
                <li>Disposer de la capacite juridique pour conclure des contrats</li>
                <li>Fournir des informations exactes et completes lors de l&apos;inscription</li>
                <li>Maintenir la securite de votre compte et mot de passe</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                Vous etes responsable de toute activite effectuee sous votre compte.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-xl font-bold text-navy mb-4">3. Role de la Plateforme</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Moyawim.ma agit uniquement en qualite d&apos;intermediaire technique. Nous ne sommes pas partie aux contrats conclus entre Employeurs et Travailleurs.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Nous ne garantissons pas la qualite des services rendus, la disponibilite des Travailleurs, ni l&apos;execution des missions publiees.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-xl font-bold text-navy mb-4">4. Obligations des Utilisateurs</h2>
              
              <h3 className="font-semibold text-navy mb-2">Pour les Employeurs :</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>Decrire les missions de maniere precise et honnete</li>
                <li>Payer le montant convenu une fois la mission completee</li>
                <li>Traiter les Travailleurs avec respect</li>
                <li>Ne pas demander de services illegaux</li>
              </ul>

              <h3 className="font-semibold text-navy mb-2">Pour les Travailleurs :</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Fournir des informations exactes sur leurs competences</li>
                <li>Realiser les missions acceptees avec professionnalisme</li>
                <li>Respecter les delais convenus</li>
                <li>Etre en conformite avec les reglementations en vigueur</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-xl font-bold text-navy mb-4">5. Paiements et Frais</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Les paiements sont effectues via notre systeme securise. Une commission de 10% est prelevee sur chaque transaction completee.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                L&apos;argent est place en sequestre jusqu&apos;a la validation de la mission par l&apos;Employeur.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-xl font-bold text-navy mb-4">6. Litiges</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                En cas de litige entre un Employeur et un Travailleur, Moyawim.ma peut intervenir en tant que mediateur. Notre decision sera finale et contraignante.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Les litiges doivent etre signales dans les 48 heures suivant la completion de la mission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-xl font-bold text-navy mb-4">7. Propriete Intellectuelle</h2>
              <p className="text-muted-foreground leading-relaxed">
                Tout le contenu de la plateforme (logos, textes, design) est la propriete de Moyawim.ma. Toute reproduction non autorisee est interdite.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-xl font-bold text-navy mb-4">8. Limitation de Responsabilite</h2>
              <p className="text-muted-foreground leading-relaxed">
                Moyawim.ma ne saurait etre tenu responsable des dommages directs ou indirects resultant de l&apos;utilisation de la plateforme ou des services fournis par les Travailleurs.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-xl font-bold text-navy mb-4">9. Modification des CGU</h2>
              <p className="text-muted-foreground leading-relaxed">
                Nous nous reservons le droit de modifier ces conditions a tout moment. Les utilisateurs seront informes des changements significatifs par email ou notification.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-xl font-bold text-navy mb-4">10. Contact</h2>
              <p className="text-muted-foreground leading-relaxed">
                Pour toute question concernant ces conditions, contactez-nous a :<br />
                <a href="mailto:legal@moyawim.ma" className="text-orange hover:underline">legal@moyawim.ma</a>
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
            <Link href="/privacy" className="text-muted-foreground hover:text-orange">
              Confidentialite
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
