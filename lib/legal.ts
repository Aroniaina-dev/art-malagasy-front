import type { Lang } from "./dictionaries";
import { BRAND, EMAIL, PHONE } from "./site";

/**
 * Conditions générales de vente (CGV) et d'utilisation (CGU).
 * Rédigées à partir du questionnaire rempli par la boutique (novembre 2026). Ce ne sont pas des textes
 * validés par un juriste : toute modification de fond doit être relue avant publication.
 */

export type LegalDoc = {
  title: string;
  intro: string;
  updated: string;
  sections: { h: string; p: string[] }[];
};

/** Identité du vendeur, telle que déclarée dans le questionnaire. */
const SELLER = {
  name: "RAKOTO RADONIRINA Dieudonné Samuel",
  address: "Lot III B 138 Morarano Andoharanofotsy, Madagascar",
  registration: "16292 11 2026 0 21856",
};

const cgvFr: LegalDoc = {
  title: "Conditions générales de vente",
  intro: `Les présentes conditions régissent les ventes conclues sur le site ${BRAND}. Toute commande implique leur acceptation.`,
  updated: "Dernière mise à jour : 22 novembre 2026",
  sections: [
    {
      h: "1. Le vendeur",
      p: [
        `${BRAND} est une marque exploitée par ${SELLER.name}, ${SELLER.address}.`,
        `Numéro d'immatriculation : ${SELLER.registration}.`,
        `Contact : ${EMAIL} · ${PHONE}.`,
      ],
    },
    {
      h: "2. Champ d'application",
      p: [
        "Ces conditions s'appliquent à toutes les commandes passées sur le site, par des particuliers comme par des professionnels, quel que soit le pays de livraison.",
        "Les conditions applicables sont celles en vigueur à la date de la commande. Pour une commande professionnelle ou en quantité, des conditions particulières peuvent être convenues par écrit avec le vendeur ; elles complètent alors les présentes.",
      ],
    },
    {
      h: "3. Les produits",
      p: [
        "Les articles proposés sont des pièces artisanales, fabriquées à la main à Madagascar. De légères différences de teinte, de dimensions ou de motif d'une pièce à l'autre sont normales et ne constituent pas un défaut.",
        "Les photographies présentent les articles le plus fidèlement possible, sans pouvoir garantir une identité parfaite avec la pièce livrée.",
      ],
    },
    {
      h: "4. Les prix",
      p: [
        "Les prix sont indiqués en euros. Un affichage en dollars peut être proposé à titre indicatif : seul le montant en euros fait foi.",
        "Les prix affichés ne comprennent pas les frais de livraison, qui sont convenus avec le client avant le paiement (voir l'article 8).",
        "Pour une vente au détail, les droits de douane, taxes d'importation et frais éventuellement réclamés par le pays de destination sont à la charge du client. Pour les autres ventes, leur prise en charge est convenue avec le client avant la confirmation de la commande.",
      ],
    },
    {
      h: "5. La commande",
      p: [
        "Le client choisit ses articles, les ajoute au panier puis renseigne ses coordonnées. Aucun compte n'est nécessaire. Un code de suivi lui est remis à la fin de la commande.",
        "La commande passée sur le site est une demande de commande. Le vendeur contacte ensuite le client pour confirmer la disponibilité, le délai de fabrication, le mode d'expédition et les frais de livraison.",
        "La vente est conclue lorsque le client a accepté ces éléments et versé l'acompte prévu à l'article 6. Le vendeur peut refuser une commande, notamment en cas d'indisponibilité d'un article ou d'erreur manifeste sur un prix.",
      ],
    },
    {
      h: "6. Le paiement",
      p: [
        "Le paiement se fait en deux fois : 50 % du montant à la commande, pour lancer la fabrication, puis 50 % avant l'expédition.",
        "Les moyens de paiement acceptés sont le virement bancaire et Western Union. Le site ne propose pas de paiement en ligne : les coordonnées de paiement sont communiquées au client lors de la confirmation de la commande.",
        "La fabrication ne débute qu'à réception de l'acompte, et l'expédition qu'à réception du solde.",
      ],
    },
    {
      h: "7. La fabrication",
      p: [
        "Les articles sont fabriqués à la commande. Le délai de fabrication dépend des pièces et des quantités : il est convenu avec le client lors de la confirmation, avant le versement de l'acompte.",
        "En cas de retard, le vendeur en informe le client dès qu'il en a connaissance.",
      ],
    },
    {
      h: "8. La livraison",
      p: [
        "Les commandes sont expédiées dans le monde entier, par avion ou par conteneur maritime selon ce qui est convenu avec le client.",
        "Les frais et le délai de livraison dépendent de la destination, du volume et du mode d'expédition. Ils sont communiqués au client et acceptés par lui avant le paiement.",
        "Le client fournit une adresse de livraison complète et exacte. À la réception, il lui appartient de vérifier l'état du colis et de son contenu.",
      ],
    },
    {
      h: "9. Retours et réclamations",
      p: [
        `Toute réclamation doit être adressée au vendeur dans les 2 jours suivant la réception de la commande, par email à ${EMAIL} ou par WhatsApp, accompagnée de photographies de l'article.`,
        "Si un article arrive abîmé ou ne correspond pas à la commande, le vendeur procède à son échange. Les modalités du renvoi sont convenues avec le client.",
        "Les pièces réalisées sur mesure ou personnalisées à la demande du client ne sont ni reprises ni échangées.",
        "Ces dispositions ne privent pas le consommateur des droits que la loi de son pays de résidence lui accorde de manière impérative.",
      ],
    },
    {
      h: "10. Le suivi de commande",
      p: [
        "Le code de suivi remis à la fin de la commande permet de consulter son avancement sur le site : fabrication, envoi, puis paiement. Ce code est personnel ; il appartient au client de le conserver.",
      ],
    },
    {
      h: "11. Responsabilité",
      p: [
        "Le vendeur ne peut être tenu responsable d'un retard ou d'une inexécution dus à un cas de force majeure, à une décision des autorités douanières ou à une information inexacte fournie par le client.",
        "Les articles sont destinés à un usage normal. Le vendeur n'est pas responsable des dommages résultant d'un usage inapproprié.",
      ],
    },
    {
      h: "12. Données personnelles",
      p: [
        "Les informations recueillies lors d'une commande servent à la traiter et à la livrer. Leur traitement est décrit dans les conditions générales d'utilisation du site.",
      ],
    },
    {
      h: "13. Droit applicable et litiges",
      p: [
        "Les présentes conditions sont soumises au droit malgache. En cas de différend, le client est invité à contacter d'abord le vendeur afin de rechercher une solution amiable.",
        "À défaut d'accord, le litige relève des tribunaux compétents de Madagascar, sous réserve des règles impératives qui protègent le consommateur dans son pays de résidence.",
      ],
    },
    {
      h: "14. Modification des conditions",
      p: ["Le vendeur peut modifier les présentes conditions. Les conditions applicables à une commande restent celles en vigueur à sa date."],
    },
  ],
};

const cgvEn: LegalDoc = {
  title: "Terms of Sale",
  intro: `These terms govern sales made on the ${BRAND} website. Placing an order means accepting them.`,
  updated: "Last updated: 22 November 2026",
  sections: [
    {
      h: "1. The seller",
      p: [
        `${BRAND} is a brand operated by ${SELLER.name}, ${SELLER.address}.`,
        `Registration number: ${SELLER.registration}.`,
        `Contact: ${EMAIL} · ${PHONE}.`,
      ],
    },
    {
      h: "2. Scope",
      p: [
        "These terms apply to all orders placed on the website, by private individuals and by businesses, whatever the country of delivery.",
        "The applicable terms are those in force on the date of the order. For a business or bulk order, specific terms may be agreed in writing with the seller; they then supplement these terms.",
      ],
    },
    {
      h: "3. The products",
      p: [
        "The items offered are handcrafted pieces, made by hand in Madagascar. Slight differences in shade, size or pattern from one piece to another are normal and are not defects.",
        "Photographs show the items as faithfully as possible, but cannot guarantee that the delivered piece will be perfectly identical.",
      ],
    },
    {
      h: "4. Prices",
      p: [
        "Prices are shown in euros. A dollar amount may be displayed for information only: the euro amount alone is binding.",
        "Displayed prices do not include delivery costs, which are agreed with the customer before payment (see section 8).",
        "For retail sales, customs duties, import taxes and any charges levied by the destination country are borne by the customer. For other sales, who bears them is agreed with the customer before the order is confirmed.",
      ],
    },
    {
      h: "5. Ordering",
      p: [
        "The customer chooses items, adds them to the cart and provides contact details. No account is required. A tracking code is given at the end of the order.",
        "An order placed on the website is an order request. The seller then contacts the customer to confirm availability, the production lead time, the shipping method and the delivery costs.",
        "The sale is concluded once the customer has accepted these details and paid the deposit described in section 6. The seller may decline an order, in particular if an item is unavailable or a price is obviously wrong.",
      ],
    },
    {
      h: "6. Payment",
      p: [
        "Payment is made in two instalments: 50% of the amount when ordering, to start production, then 50% before shipping.",
        "Accepted payment methods are bank transfer and Western Union. The website does not offer online payment: payment details are sent to the customer when the order is confirmed.",
        "Production starts only once the deposit has been received, and shipping only once the balance has been received.",
      ],
    },
    {
      h: "7. Production",
      p: [
        "Items are made to order. The production lead time depends on the pieces and quantities: it is agreed with the customer at confirmation, before the deposit is paid.",
        "If there is a delay, the seller informs the customer as soon as it becomes aware of it.",
      ],
    },
    {
      h: "8. Delivery",
      p: [
        "Orders are shipped worldwide, by air or by sea container, as agreed with the customer.",
        "Delivery costs and times depend on the destination, the volume and the shipping method. They are communicated to the customer and accepted by the customer before payment.",
        "The customer provides a complete and accurate delivery address. On receipt, it is the customer's responsibility to check the condition of the parcel and its contents.",
      ],
    },
    {
      h: "9. Returns and complaints",
      p: [
        `Any complaint must be sent to the seller within 2 days of receiving the order, by email to ${EMAIL} or by WhatsApp, together with photographs of the item.`,
        "If an item arrives damaged or does not match the order, the seller exchanges it. The arrangements for sending it back are agreed with the customer.",
        "Pieces made to measure or personalised at the customer's request are neither taken back nor exchanged.",
        "These provisions do not deprive consumers of the rights that the law of their country of residence grants them on a mandatory basis.",
      ],
    },
    {
      h: "10. Order tracking",
      p: [
        "The tracking code given at the end of the order lets the customer follow its progress on the website: production, shipping, then payment. This code is personal; the customer is responsible for keeping it.",
      ],
    },
    {
      h: "11. Liability",
      p: [
        "The seller cannot be held liable for a delay or failure caused by force majeure, a decision of the customs authorities, or inaccurate information provided by the customer.",
        "The items are intended for normal use. The seller is not liable for damage resulting from inappropriate use.",
      ],
    },
    {
      h: "12. Personal data",
      p: ["Information collected when ordering is used to process and deliver the order. How it is handled is described in the website's Terms of Use."],
    },
    {
      h: "13. Governing law and disputes",
      p: [
        "These terms are governed by Malagasy law. In the event of a disagreement, the customer is invited to contact the seller first in order to find an amicable solution.",
        "Failing agreement, the dispute falls within the jurisdiction of the competent courts of Madagascar, subject to the mandatory rules that protect consumers in their country of residence.",
      ],
    },
    {
      h: "14. Changes to these terms",
      p: ["The seller may change these terms. The terms applicable to an order remain those in force on its date."],
    },
    {
      h: "15. Language",
      p: ["These terms were written in French. This English version is a translation provided for convenience; if the two differ, the French version prevails."],
    },
  ],
};

const cguFr: LegalDoc = {
  title: "Conditions générales d'utilisation",
  intro: `Les présentes conditions encadrent l'utilisation du site ${BRAND}. En naviguant sur le site, vous les acceptez.`,
  updated: "Dernière mise à jour : 22 novembre 2026",
  sections: [
    {
      h: "1. Éditeur du site",
      p: [
        `Le site est édité par ${SELLER.name}, ${SELLER.address}, sous la marque ${BRAND}.`,
        `Numéro d'immatriculation : ${SELLER.registration}. Contact : ${EMAIL} · ${PHONE}.`,
        "Le site est hébergé par Vercel Inc. (États-Unis).",
      ],
    },
    {
      h: "2. Objet du site",
      p: ["Le site présente les créations artisanales de la marque et permet de passer une commande, de suivre son avancement et de contacter le vendeur. Les ventes sont régies par les conditions générales de vente."],
    },
    {
      h: "3. Accès au site",
      p: ["Le site est accessible gratuitement. L'éditeur s'efforce de le maintenir disponible, sans pouvoir garantir une disponibilité permanente : il peut être interrompu pour maintenance ou pour une raison indépendante de sa volonté."],
    },
    {
      h: "4. Compte utilisateur",
      p: [
        "La création d'un compte est facultative : il n'est pas nécessaire pour commander.",
        "L'utilisateur qui crée un compte fournit des informations exactes et garde son mot de passe confidentiel. Il est responsable de l'usage qui est fait de son compte et prévient l'éditeur en cas d'utilisation non autorisée.",
      ],
    },
    {
      h: "5. Propriété intellectuelle",
      p: ["Les textes, photographies, illustrations, le logo et la marque présents sur le site appartiennent à l'éditeur ou sont utilisés avec autorisation. Toute reproduction ou réutilisation sans accord écrit préalable est interdite."],
    },
    {
      h: "6. Utilisation du site",
      p: ["L'utilisateur s'engage à utiliser le site conformément à sa destination. Il s'interdit notamment d'en perturber le fonctionnement, de tenter d'accéder à des espaces qui ne lui sont pas destinés, ou de transmettre de fausses informations lors d'une commande ou d'une prise de contact."],
    },
    {
      h: "7. Données personnelles",
      p: [
        "Données recueillies : lors d'une commande, le nom, le prénom, le téléphone, l'adresse de livraison et, si elle est fournie, l'adresse email ; lors de la création d'un compte, le nom, le prénom, l'adresse email et, s'il est fourni, le téléphone ; lors d'une prise de contact, le nom, l'adresse email et le message.",
        "Finalités : ces données servent à traiter et livrer les commandes, à gérer le compte et à répondre aux messages. Elles ne sont ni vendues ni utilisées à des fins publicitaires.",
        "Destinataires : elles sont transmises aux seuls prestataires nécessaires à l'exécution de la commande, notamment le transporteur, et aux prestataires techniques qui hébergent le site.",
        `Vos droits : vous pouvez demander l'accès à vos données, leur rectification ou leur suppression en écrivant à ${EMAIL}.`,
      ],
    },
    {
      h: "8. Cookies et stockage local",
      p: [
        "Le site n'utilise pas de cookie publicitaire ni de traceur d'audience. Il utilise uniquement ce qui est nécessaire à son fonctionnement : un cookie de session lorsque vous êtes connecté, un cookie qui retient la langue choisie, et le stockage local de votre navigateur pour conserver votre panier et la devise d'affichage.",
      ],
    },
    {
      h: "9. Liens externes",
      p: ["Le site contient des liens vers des services tiers, par exemple WhatsApp. L'éditeur n'est pas responsable du contenu ni des pratiques de ces services."],
    },
    {
      h: "10. Responsabilité",
      p: ["L'éditeur apporte le plus grand soin aux informations publiées, sans pouvoir garantir l'absence d'erreur. Il ne peut être tenu responsable d'un dommage résultant de l'indisponibilité du site ou d'un usage du site contraire aux présentes conditions."],
    },
    {
      h: "11. Droit applicable",
      p: ["Les présentes conditions sont soumises au droit malgache, sous réserve des règles impératives qui protègent le consommateur dans son pays de résidence."],
    },
    {
      h: "12. Modification des conditions",
      p: ["L'éditeur peut modifier les présentes conditions. La version applicable est celle publiée sur le site à la date de votre visite."],
    },
  ],
};

const cguEn: LegalDoc = {
  title: "Terms of Use",
  intro: `These terms govern the use of the ${BRAND} website. By browsing the website, you accept them.`,
  updated: "Last updated: 22 November 2026",
  sections: [
    {
      h: "1. Website publisher",
      p: [
        `The website is published by ${SELLER.name}, ${SELLER.address}, under the ${BRAND} brand.`,
        `Registration number: ${SELLER.registration}. Contact: ${EMAIL} · ${PHONE}.`,
        "The website is hosted by Vercel Inc. (United States).",
      ],
    },
    {
      h: "2. Purpose of the website",
      p: ["The website presents the brand's handcrafted pieces and lets visitors place an order, follow its progress and contact the seller. Sales are governed by the Terms of Sale."],
    },
    {
      h: "3. Access to the website",
      p: ["The website is free to access. The publisher strives to keep it available but cannot guarantee permanent availability: it may be interrupted for maintenance or for reasons beyond the publisher's control."],
    },
    {
      h: "4. User account",
      p: [
        "Creating an account is optional: it is not required to place an order.",
        "Users who create an account provide accurate information and keep their password confidential. They are responsible for the use made of their account and inform the publisher of any unauthorised use.",
      ],
    },
    {
      h: "5. Intellectual property",
      p: ["The texts, photographs, illustrations, logo and brand shown on the website belong to the publisher or are used with permission. Any reproduction or reuse without prior written consent is prohibited."],
    },
    {
      h: "6. Use of the website",
      p: ["Users agree to use the website for its intended purpose. In particular, they must not disrupt its operation, attempt to access areas not intended for them, or provide false information when ordering or making contact."],
    },
    {
      h: "7. Personal data",
      p: [
        "Data collected: when ordering, last name, first name, phone number, delivery address and, if provided, email address; when creating an account, last name, first name, email address and, if provided, phone number; when making contact, name, email address and message.",
        "Purposes: this data is used to process and deliver orders, manage the account and reply to messages. It is neither sold nor used for advertising.",
        "Recipients: it is passed only to the providers needed to fulfil the order, in particular the carrier, and to the technical providers that host the website.",
        `Your rights: you can ask to access, correct or delete your data by writing to ${EMAIL}.`,
      ],
    },
    {
      h: "8. Cookies and local storage",
      p: [
        "The website uses no advertising cookies and no audience trackers. It uses only what it needs to work: a session cookie when you are signed in, a cookie that remembers the chosen language, and your browser's local storage to keep your cart and display currency.",
      ],
    },
    {
      h: "9. External links",
      p: ["The website contains links to third-party services, such as WhatsApp. The publisher is not responsible for the content or practices of those services."],
    },
    {
      h: "10. Liability",
      p: ["The publisher takes great care over the information published but cannot guarantee that it is free of errors. It cannot be held liable for damage resulting from the website being unavailable or from use of the website contrary to these terms."],
    },
    {
      h: "11. Governing law",
      p: ["These terms are governed by Malagasy law, subject to the mandatory rules that protect consumers in their country of residence."],
    },
    {
      h: "12. Changes to these terms",
      p: ["The publisher may change these terms. The applicable version is the one published on the website on the date of your visit."],
    },
    {
      h: "13. Language",
      p: ["These terms were written in French. This English version is a translation provided for convenience; if the two differ, the French version prevails."],
    },
  ],
};

export const legal: Record<"cgv" | "cgu", Record<Lang, LegalDoc>> = {
  cgv: { fr: cgvFr, en: cgvEn },
  cgu: { fr: cguFr, en: cguEn },
};
