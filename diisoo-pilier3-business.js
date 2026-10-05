/* DIISOO : PILIER 3 BUSINESS (5 categories x 3 niveaux). Wolof a faire relire. */
(function diisooBusiness() {
  "use strict";
  const _L = (s) => s.trim().split("\n").map((l) => l.split("|").map((x) => x.trim()));
  const _P = (s) => _L(s).map(([en, fr, wo]) => (wo ? { en, fr, wo } : { en, fr }));
  const _B = (scene, s) => s.trim().split("\n").map((l, i) => {
    const m = l.match(/^([CM])>\s*(.*)$/);
    const [en, fr, wo] = m[2].split("|").map((x) => x.trim());
    const o = { role: m[1] === "C" ? "client" : "marchand", wo, fr, en };
    if (i === 0) o.scene = scene;
    return o;
  });
  const BIZ = {};
  BIZ.pieces = {
    deb: _P(`
Brake pads | Plaquettes de frein | Plakët fren
Tyre | Pneu | Pneu
Battery | Batterie | Batri
Oil filter | Filtre à huile | Filtar diw
Spark plug | Bougie | Buji
Headlight | Phare | Far
Engine | Moteur | Moteur
Gearbox | Boîte de vitesses | Bwat vitees
Clutch | Embrayage | Embrayaas
Radiator | Radiateur | Radiyatëer
Wiper | Essuie-glace | Esuyi glas
Mirror | Rétroviseur | Retroviseer
Bumper | Pare-chocs | Paar-choks
Original | D'origine | Ci fabrik
Copy | Copie | Kopi
New | Neuf | Bees
Used | D'occasion | Ocasiyoŋ
`),
    inter: _P(`
Do you have this part in stock? | L'avez-vous en stock ? | Ndax am nga ko ci stok ?
I need the part for a Toyota Corolla | Il me faut la pièce pour une Toyota Corolla | Soxla naa pièce bu Toyota Corolla
What year is the car? | De quelle année est la voiture ? | Ban at la oto bi ?
Show me the old part | Montrez-moi l'ancienne pièce | Won ma pièce bu njëkk bi
How long does it last? | Combien de temps dure-t-elle ? | Ñaata la di yàgg ?
Can you fit it for me? | Pouvez-vous la monter pour moi ? | Mën nga ma ko taxawal ?
This one is a good copy | Celle-ci est une bonne copie | Kii kopi bu baax la
Is it for petrol or diesel? | C'est pour essence ou diesel ? | Ndax essãas la walla gasoil ?
My car does not start | Ma voiture ne démarre pas | Sama oto bi demul
There is a strange noise | Il y a un bruit bizarre | Am na coow lu bees
I need a cheaper option | Il me faut une option moins chère | Soxla naa lu gën a yomb
Can I return it if it does not fit? | Puis-je la rendre si elle ne va pas ? | Mën naa ko delloo bu yemul ?
Please write the price | Écrivez le prix, s'il vous plaît | Bind njëg bi, baal ma
How many do you have? | Combien en avez-vous ? | Ñaata nga am ?
I will take the pair | Je prends la paire | Dinaa jël ñaar yi
Is there a guarantee? | Y a-t-il une garantie ? | Am na garanti ?
Wait, I will check the stock | Attendez, je vérifie le stock | Xaar tuuti, dinaa xool stok bi
`),
    av: _P(`
I want to order one hundred brake pads | Je veux commander cent plaquettes | Bëgg naa commande téeméer plakët fren
What is your best price for a container? | Quel est votre meilleur prix pour un conteneur ? | Ban njëg bi gën a baax ngir konteneer ?
We need a sample before the order | Il nous faut un échantillon avant la commande | Soxla nanu échantillon balaa commande bi
Is the quality certified? | La qualité est-elle certifiée ? | Ndax qualité bi am na certifika ?
What is the minimum order quantity? | Quelle est la quantité minimale de commande ? | Ban quantité bu ndaw la war a commande ?
Can you give a better price to a regular customer? | Pouvez-vous faire un meilleur prix à un client régulier ? | Mën nga def njëg bu gën a baax ngir kiliyaŋ bu mu bokk ?
We pay thirty percent now and the rest on delivery | Nous payons trente pour cent maintenant et le reste à la livraison | Dinanu fey fanweer ci téeméer léegi, li des ci livraison bi
Please send photos of every part | Envoyez des photos de chaque pièce | Yónnee ma nataal ci pièce bu nekk
What is the delivery time to Dakar? | Quel est le délai de livraison pour Dakar ? | Ñaata fan la livraison bi ci Ndakaaru ?
The shipment arrived with damaged parts | L'envoi est arrivé avec des pièces abîmées | Marsandiz bi agsi na ak pièce yu yàqu
We want a refund or a replacement | Nous voulons un remboursement ou un remplacement | Bëgg nanu ñu delloo xaalis bi walla ñu weccil ko
Can you issue an invoice in my company name? | Pouvez-vous établir une facture au nom de mon entreprise ? | Mën nga ma defal factuur ci tur sama entreprise ?
Is the price FOB or CIF? | Le prix est-il FOB ou CIF ? | Ndax njëg bi FOB la walla CIF ?
We want a long term contract | Nous voulons un contrat à long terme | Bëgg nanu kontra bu yàgg
The deadline is thirty days | Le délai est de trente jours | Bu mujj bi fanweer fan la
I will confirm after I check with my partner | Je confirme après avoir vérifié avec mon associé | Dinaa la ko wax bu ma xoolee ak sama partner
`),
    sc: {
      deb: [
        _B("🔧 Pièces détachées · Chercher un pneu", `
C> Hello, do you have tyres? | Bonjour, avez-vous des pneus ? | Salaamaalekum, am nga pneu ?
M> Yes, which size? | Oui, quelle taille ? | Waaw, ban taille ?
C> This size, new please. | Cette taille, neuf s'il vous plaît. | Taille bii, bu bees, baal ma.
M> I have it. Twenty-five thousand. | Je l'ai. Vingt-cinq mille. | Am naa ko. Ñaar-fukk ak juróom junni.`),
        _B("🔧 Pièces détachées · La batterie", `
C> I need a battery. | Il me faut une batterie. | Soxla naa batri.
M> New or used? | Neuve ou d'occasion ? | Bees walla ocasiyoŋ ?
C> New. How much? | Neuve. C'est combien ? | Bees. Ñaata la ?
M> Thirty thousand, with guarantee. | Trente mille, avec garantie. | Fanweer junni, ak garanti.`),
        _B("🔧 Pièces détachées · Un phare cassé", `
C> My headlight is broken. | Mon phare est cassé. | Sama far bi yàqu na.
M> Left or right? | Gauche ou droit ? | Càmmoñ walla ndeyjoor ?
C> The left one. | Le gauche. | Bi ci càmmoñ.
M> Wait, I will check. | Attendez, je vais voir. | Xaar tuuti, dinaa xool.`),
        _B("🔧 Pièces détachées · Un filtre à huile", `
C> One oil filter, please. | Un filtre à huile, s'il vous plaît. | Benn filtar diw, baal ma.
M> For which car? | Pour quelle voiture ? | Ngir ban oto ?
C> A Peugeot 306. | Une Peugeot 306. | Peugeot 306.
M> Here it is. Two thousand five hundred. | Voilà. Deux mille cinq cents. | Lii la. Ñaari junni ak juróom téeméer.`),
        _B("🔧 Pièces détachées · Les essuie-glaces", `
C> Do you have wipers? | Avez-vous des essuie-glaces ? | Am nga esuyi glas ?
M> Yes, original or copy? | Oui, d'origine ou copie ? | Waaw, ci fabrik walla kopi ?
C> Copy, it is cheaper. | Copie, c'est moins cher. | Kopi, dafa gën a yomb.
M> One thousand francs. | Mille francs. | Junni franc.`)
      ],
      inter: [
        _B("🔧 Pièces détachées · La voiture ne démarre pas", `
C> My car does not start. Maybe it is the battery. | Ma voiture ne démarre pas. C'est peut-être la batterie. | Sama oto bi demul. Man maa ngi jàpp ne batri la.
M> Let me test it. Yes, it is dead. | Laisse-moi la tester. Oui, elle est morte. | Bàyyi ma ko testé. Waaw, dee na.
C> How much is a new one with a guarantee? | Combien coûte une neuve avec garantie ? | Ñaata la bu bees ak garanti ?
M> Forty thousand, and the fitting is free. | Quarante mille, et le montage est gratuit. | Ñeent-fukk junni, te taxawal bi du fey.`),
        _B("🔧 Pièces détachées · Plaquettes pour Corolla", `
C> I need brake pads for a Toyota Corolla 2010. | Il me faut des plaquettes pour une Toyota Corolla 2010. | Soxla naa plakët fren ngir Toyota Corolla 2010.
M> Original or copy? | D'origine ou copie ? | Ci fabrik walla kopi ?
C> What is the difference in price? | Quelle est la différence de prix ? | Ban la diggante njëg bi ?
M> Original is thirty thousand, copy is eighteen thousand. | L'originale coûte trente mille, la copie dix-huit mille. | Bi ci fabrik fanweer junni la, kopi bi fukk ak juróom-ñett junni la.`),
        _B("🔧 Pièces détachées · Un bruit bizarre", `
C> There is a strange noise at the front. | Il y a un bruit bizarre à l'avant. | Am na coow lu bees ci kanam.
M> It may be the shock absorber. Let me look. | Ce sont peut-être les amortisseurs. Je regarde. | Man maa ngi jàpp ne amortisör la. Bàyyi ma xool.
C> Can you change it today? | Pouvez-vous le changer aujourd'hui ? | Mën nga ko soppi tey ?
M> Yes, come back at five. | Oui, revenez à dix-sept heures. | Waaw, dellusi ci juróom waxtu.`),
        _B("🔧 Pièces détachées · Rendre une pièce", `
C> This part does not fit my car. | Cette pièce ne va pas à ma voiture. | Pièce bii yemul ak sama oto.
M> Do you have the receipt? | Avez-vous le reçu ? | Am nga reçu bi ?
C> Yes, I bought it yesterday. | Oui, je l'ai achetée hier. | Waaw, jënd naa ko démb.
M> Okay, I will give you another one. | D'accord, je vous en donne une autre. | Baax na, dinaa la jox beneen.`),
        _B("🔧 Pièces détachées · Essence ou diesel", `
C> Is this oil filter for petrol or diesel? | Ce filtre à huile est-il pour essence ou diesel ? | Filtar diw bii, essãas la walla gasoil ?
M> It is for diesel. For petrol I have this one. | C'est pour diesel. Pour l'essence j'ai celui-ci. | Gasoil la. Ngir essãas am naa kii.
C> Give me two, one for each car. | Donnez-m'en deux, un pour chaque voiture. | Jox ma ñaar, benn ngir oto bu nekk.
M> Two for five thousand five hundred. | Deux pour cinq mille cinq cents. | Ñaar yi, juróom junni ak juróom téeméer.`)
      ],
      av: [
        _B("🔧 Pièces détachées · Grosse commande en Chine", `
C> We want to order five hundred brake pads for Toyota. What is your best price? | Nous voulons commander cinq cents plaquettes pour Toyota. Quel est votre meilleur prix ? | Bëgg nanu commande juróom téeméer plakët fren ngir Toyota. Ban njëg bi gën a baax ?
M> For five hundred pieces, two dollars each, FOB Guangzhou. | Pour cinq cents pièces, deux dollars chacune, FOB Canton. | Ngir juróom téeméer, ñaar dolaar ci benn, FOB Guangzhou.
C> We can pay thirty percent now and the rest before shipping. | Nous pouvons payer trente pour cent maintenant et le reste avant l'expédition. | Mën nanu fey fanweer ci téeméer léegi, li des balaa yónnee bi.
M> Agreed, but send the deposit this week. | D'accord, mais envoyez l'acompte cette semaine. | Baax na, waaye yónnee acompte bi ayubés bii.`),
        _B("🔧 Pièces détachées · Échantillon et certificat", `
C> Before the big order, send us a sample of each part. | Avant la grosse commande, envoyez-nous un échantillon de chaque pièce. | Balaa commande bu mag bi, yónnee nu échantillon ci pièce bu nekk.
M> We can send three samples. You pay the shipping. | Nous pouvons envoyer trois échantillons. Vous payez l'expédition. | Mën nanu yónnee ñett échantillon. Yéen ngeen fey yónnee bi.
C> Is the quality certified? Do you have the certificate? | La qualité est-elle certifiée ? Avez-vous le certificat ? | Ndax qualité bi am na certifika ? Am nga ko ?
M> Yes, ISO nine thousand and one. I will send it by email. | Oui, ISO neuf mille un. Je l'envoie par e-mail. | Waaw, ISO 9001. Dinaa ko yónnee ci imeel.`),
        _B("🔧 Pièces détachées · Pièces abîmées", `
C> The container arrived, but twenty pieces are damaged. | Le conteneur est arrivé, mais vingt pièces sont abîmées. | Konteneer bi agsi na, waaye ñaar-fukk pièce yàqu nañu.
M> Please send photos and the packing list. | Envoyez des photos et la liste de colisage. | Yónnee nataal yi ak packing list bi.
C> Here they are. We want a replacement in the next shipment. | Les voici. Nous voulons un remplacement dans le prochain envoi. | Lii la. Bëgg nanu weccil ci yónnee bi toppu.
M> Okay, we will add them at no cost. | D'accord, nous les ajoutons sans frais. | Baax na, dinanu leen yokk te du fey.`),
        _B("🔧 Pièces détachées · Client régulier et contrat", `
C> We buy from you every month. Can you give us a better price? | Nous achetons chez vous chaque mois. Pouvez-vous nous faire un meilleur prix ? | Danuy jënd ci yaw weer wu nekk. Mën nga nu def njëg bu gën a baax ?
M> For a one year contract, I can give five percent off. | Pour un contrat d'un an, je peux faire cinq pour cent de remise. | Ngir kontra bu benn at, mën naa wàññi juróom ci téeméer.
C> Make it eight percent and we sign today. | Faites huit pour cent et nous signons aujourd'hui. | Def ko juróom-ñett ci téeméer te dinanu signé tey.
M> Seven, and that is my final offer. | Sept, et c'est ma dernière offre. | Juróom-ñaar, te mooy sama njëg bu mujj.`),
        _B("🔧 Pièces détachées · Douane et facture", `
C> Please write the invoice in the name of my company. | Établissez la facture au nom de mon entreprise. | Defal ma factuur bi ci tur sama entreprise.
M> What is the company name and address? | Quel est le nom et l'adresse de l'entreprise ? | Ban la tur ak adrees bu entreprise bi ?
C> ABC Global, Thiès, Senegal. The customs need the exact value. | ABC Global, Thiès, Sénégal. La douane a besoin de la valeur exacte. | ABC Global, Thiès, Senegaal. Douane bi soxla na njëg bi bu mat.
M> No problem, I will send the invoice and the bill of lading. | Pas de problème, j'envoie la facture et le connaissement. | Amul jafe-jafe, dinaa yónnee factuur bi ak Bill of Lading bi.`)
      ]
    }
  };

  BIZ.mode = {
    deb: _P(`
Dress | Robe | Robu
Shirt | Chemise | Simis
Trousers | Pantalon | Pantalon
Fabric | Tissu | Tissu
Shoes | Chaussures | Dàll
Bag | Sac | Saak
Hair | Cheveux | Kawar
Wig | Perruque | Peruk
Perfume | Parfum | Parfem
Soap | Savon | Saabu
Cream | Crème | Kerem
Lipstick | Rouge à lèvres | Rujlev
Size | Taille | Taille
Colour | Couleur | Kuloor
Gold | Or | Wurus
Boubou | Boubou | Mbubb
Scarf | Foulard | Fulaar
`),
    inter: _P(`
Do you have a bigger size? | Avez-vous une taille plus grande ? | Am nga taille bu gën a mag ?
Can I try it on? | Puis-je l'essayer ? | Mën naa ko jéem ?
Where is the fitting room? | Où est la cabine d'essayage ? | Fu néegu jéem bi nekk ?
This colour suits you | Cette couleur vous va bien | Kuloor bii dafa la neex
I am looking for a gift | Je cherche un cadeau | Maa ngi wut kado
Is this fabric cotton? | Ce tissu est-il en coton ? | Ndax tissu bii kotoŋ la ?
Does it shrink in the wash? | Rétrécit-il au lavage ? | Ndax day ndaw bu ñu ko raxasee ?
Can you make it to my size? | Pouvez-vous le faire à ma taille ? | Mën nga ko def ci sama taille ?
When will it be ready? | Quand sera-ce prêt ? | Kañ la di mat ?
I want natural hair products | Je veux des produits capillaires naturels | Bëgg naa produi yu kawar yu natirel
Is this perfume original? | Ce parfum est-il d'origine ? | Ndax parfem bii ci fabrik la ?
How much for the whole set? | Combien pour tout l'ensemble ? | Ñaata ngir ensemble bi bépp ?
I will pay by Wave | Je paie par Wave | Dinaa fey ci Wave
Please wrap it as a gift | Emballez-le comme un cadeau, s'il vous plaît | Takkal ko ni kado, baal ma
The zip is broken | La fermeture est cassée | Fermetir bi yàqu na
I want to exchange it | Je veux l'échanger | Bëgg naa ko soppi
Do you have it in black? | L'avez-vous en noir ? | Am nga ko ci ñuul ?
`),
    av: _P(`
We sell wholesale to shops in Thiès | Nous vendons en gros aux boutiques de Thiès | Danuy jaay ci gros ci boutik yi ci Thiès
What is the minimum quantity for wholesale? | Quelle est la quantité minimale pour le gros ? | Ban quantité bu ndaw la ngir gros ?
I want to import wax fabric from China | Je veux importer du tissu wax de Chine | Bëgg naa import tissu wax bu jóge Siin
Can you print our own design? | Pouvez-vous imprimer notre propre motif ? | Mën nga ko print ci sunu dessin ?
We need the colours to match the sample | Il nous faut des couleurs conformes à l'échantillon | Soxla nanu kuloor yu yem ak échantillon bi
What is the lead time for production? | Quel est le délai de production ? | Ñaata fan la production bi di yàgg ?
Is the dye colour fast? | La teinture est-elle résistante ? | Ndax kuloor bi day dem ?
Do you have a certificate for the cosmetics? | Avez-vous un certificat pour les cosmétiques ? | Am nga certifika ngir cosmétique yi ?
Check the expiry date before shipping | Vérifiez la date de péremption avant l'envoi | Xool bés bu mujj bi balaa yónnee bi
We want our logo on the packaging | Nous voulons notre logo sur l'emballage | Bëgg nanu sunu logo ci emballaas bi
I sell to customers on social media | Je vends à des clients sur les réseaux sociaux | Damay jaay ci kiliyaŋ yi ci réso sosyal
Can you ship directly to my customers? | Pouvez-vous expédier directement à mes clients ? | Mën nga yónnee ci sama kiliyaŋ yi ci kanam ?
I need a better price for a hundred pieces | Il me faut un meilleur prix pour cent pièces | Soxla naa njëg bu gën a baax ngir téeméer pièce
Returns are accepted within seven days | Les retours sont acceptés sous sept jours | Dañuy nangu dellu ci diggante juróom-ñaar fan
We offer exclusive rights for Senegal | Nous offrons l'exclusivité pour le Sénégal | Danuy joxe exclusivité ngir Senegaal
Let us sign the agreement | Signons l'accord | Nanu signé accord bi
`),
    sc: {
      deb: [
        _B("👗 Mode & beauté · Une robe", `
C> I want a dress. | Je voudrais une robe. | Bëgg naa robu.
M> What size? | Quelle taille ? | Ban taille ?
C> Medium. Do you have red? | Moyenne. Avez-vous du rouge ? | Moyenne. Am nga ko ci xonq ?
M> Yes. Eight thousand. | Oui. Huit mille. | Waaw. Juróom-ñett junni.`),
        _B("👗 Mode & beauté · Le tissu", `
C> How much is this fabric? | Combien coûte ce tissu ? | Ñaata la tissu bii ?
M> Three thousand a metre. | Trois mille le mètre. | Ñett junni ci metar bi.
C> I will take five metres. | Je prends cinq mètres. | Dinaa jël juróom metar.
M> Fifteen thousand in total. | Quinze mille en tout. | Fukk ak juróom junni ci bépp.`),
        _B("👗 Mode & beauté · Des chaussures", `
C> Do you have these shoes in size forty? | Avez-vous ces chaussures en quarante ? | Am nga dàll yii ci ñeent-fukk ?
M> Yes, in black and brown. | Oui, en noir et marron. | Waaw, ci ñuul ak marron.
C> I take the black ones. | Je prends les noires. | Dinaa jël yu ñuul yi.
M> Ten thousand. | Dix mille. | Fukk junni.`),
        _B("👗 Mode & beauté · Un parfum", `
C> I like this perfume. How much is it? | J'aime ce parfum. C'est combien ? | Parfem bii neex na ma. Ñaata la ?
M> Twelve thousand, it is original. | Douze mille, il est d'origine. | Fukk ak ñaar junni, ci fabrik la.
C> Can I try another one? | Puis-je en essayer un autre ? | Mën naa jéem beneen ?
M> Of course, try this one. | Bien sûr, essayez celui-ci. | Waaw, jéemal kii.`),
        _B("👗 Mode & beauté · Savon et crème", `
C> I want soap and body cream. | Je veux du savon et de la crème pour le corps. | Bëgg naa saabu ak kerem ngir yaram.
M> Natural or normal? | Naturel ou normal ? | Natirel walla normaal ?
C> Natural, please. How much? | Naturel, s'il vous plaît. C'est combien ? | Natirel, baal ma. Ñaata la ?
M> Four thousand for the two. | Quatre mille pour les deux. | Ñeent junni ngir ñaar yi.`)
      ],
      inter: [
        _B("👗 Mode & beauté · Essayer une taille", `
C> Do you have a bigger size? This one is small. | Avez-vous une taille plus grande ? Celle-ci est petite. | Am nga taille bu gën a mag ? Bii dafa ndaw.
M> Try this one. The fitting room is there. | Essayez celle-ci. La cabine est là. | Jéemal bii. Néegu jéem bi, fale la nekk.
C> It fits well. Do you have it in blue? | Elle me va bien. L'avez-vous en bleu ? | Dafa ma yem. Am nga ko ci bleu ?
M> Yes, I will bring it. | Oui, je l'apporte. | Waaw, dinaa ko indi.`),
        _B("👗 Mode & beauté · Chez le couturier", `
C> Can you make this boubou to my size? | Pouvez-vous faire ce boubou à ma taille ? | Mën nga def mbubb mii ci sama taille ?
M> Yes. I need to take your measurements. | Oui. Je dois prendre vos mesures. | Waaw. War naa jël sa mesure yi.
C> When will it be ready? | Quand sera-t-il prêt ? | Kañ la di mat ?
M> In one week. Pay half now. | Dans une semaine. Payez la moitié maintenant. | Ci benn ayubés. Fey genn-wàll léegi.`),
        _B("👗 Mode & beauté · Un cadeau", `
C> I am looking for a gift for my mother. | Je cherche un cadeau pour ma mère. | Maa ngi wut kado ngir sama yaay.
M> A scarf or a perfume? | Un foulard ou un parfum ? | Fulaar walla parfem ?
C> A scarf. Please wrap it as a gift. | Un foulard. Emballez-le comme un cadeau, s'il vous plaît. | Fulaar. Takkal ko ni kado, baal ma.
M> Of course, madam. | Bien sûr, madame. | Baax na, soxna.`),
        _B("👗 Mode & beauté · Échanger un article", `
C> I bought this dress yesterday, but the zip is broken. | J'ai acheté cette robe hier, mais la fermeture est cassée. | Jënd naa robu bii démb, waaye fermetir bi yàqu na.
M> I am sorry. Do you have the receipt? | Je suis désolé. Avez-vous le reçu ? | Baal ma. Am nga reçu bi ?
C> Yes, here it is. I want to exchange it. | Oui, le voici. Je veux l'échanger. | Waaw, lii la. Bëgg naa ko soppi.
M> Choose another one, no problem. | Choisissez-en une autre, pas de problème. | Tànnal beneen, amul jafe-jafe.`),
        _B("👗 Mode & beauté · Payer par Wave", `
C> I will take three dresses. How much for all? | Je prends trois robes. Combien pour tout ? | Dinaa jël ñett robu. Ñaata ngir yépp ?
M> Twenty-four thousand, but twenty for you. | Vingt-quatre mille, mais vingt pour vous. | Ñaar-fukk ak ñeent junni, waaye ñaar-fukk junni ngir yaw.
C> I will pay by Wave. | Je paie par Wave. | Dinaa fey ci Wave.
M> Perfect, send it to this number. | Parfait, envoyez sur ce numéro. | Baax na, yónnee ko ci nimero bii.`)
      ],
      av: [
        _B("👗 Mode & beauté · Vente en gros", `
C> We sell to shops in Thiès. What is the minimum for wholesale? | Nous vendons à des boutiques de Thiès. Quel est le minimum pour le gros ? | Danuy jaay ci boutik yi ci Thiès. Ban quantité bu ndaw la ngir gros ?
M> Fifty pieces per model. | Cinquante pièces par modèle. | Juróom-fukk pièce ci modèle bu nekk.
C> Can you give ten percent off for fifty pieces? | Pouvez-vous faire dix pour cent pour cinquante pièces ? | Mën nga wàññi fukk ci téeméer ngir juróom-fukk pièce ?
M> Yes, if you pay cash. | Oui, si vous payez comptant. | Waaw, bu ngeen fey ci xaalis bu nekk.`),
        _B("👗 Mode & beauté · Importer du wax", `
C> I want to import wax fabric from China. Can you print our own design? | Je veux importer du tissu wax de Chine. Pouvez-vous imprimer notre propre motif ? | Bëgg naa import tissu wax bu jóge Siin. Mën nga ko print ci sunu dessin ?
M> Yes, send the file. Minimum one thousand metres. | Oui, envoyez le fichier. Minimum mille mètres. | Waaw, yónnee fichier bi. Bu ndaw bi, junni metar.
C> What is the production time? | Quel est le délai de production ? | Ñaata fan la production bi di yàgg ?
M> Twenty-five days, then shipping. | Vingt-cinq jours, puis l'expédition. | Ñaar-fukk ak juróom fan, ba noppi yónnee bi.`),
        _B("👗 Mode & beauté · Cosmétiques et certificat", `
C> Do you have a certificate for these cosmetics? | Avez-vous un certificat pour ces cosmétiques ? | Am nga certifika ngir cosmétique yii ?
M> Yes, and the expiry date is in two years. | Oui, et la date de péremption est dans deux ans. | Waaw, te bés bu mujj bi ci ñaari at la.
C> We want our logo on the packaging. | Nous voulons notre logo sur l'emballage. | Bëgg nanu sunu logo ci emballaas bi.
M> Possible from three thousand pieces. | Possible à partir de trois mille pièces. | Mën na ba ci ñett junni pièce.`),
        _B("👗 Mode & beauté · Vendre sur les réseaux", `
C> I sell on social media. Can you ship directly to my customers? | Je vends sur les réseaux sociaux. Pouvez-vous expédier directement à mes clients ? | Damay jaay ci réso sosyal. Mën nga yónnee ci sama kiliyaŋ yi ci kanam ?
M> Yes, we do dropshipping. Each parcel costs extra. | Oui, nous faisons du dropshipping. Chaque colis coûte en plus. | Waaw, danuy def dropshipping. Colis bu nekk dafa am njëg bu ci yokk.
C> What is the price per parcel? | Quel est le prix par colis ? | Ñaata la colis bu nekk ?
M> Three dollars to Dakar. | Trois dollars pour Dakar. | Ñett dolaar ngir Ndakaaru.`),
        _B("👗 Mode & beauté · Exclusivité", `
C> We want exclusive rights for Senegal. | Nous voulons l'exclusivité pour le Sénégal. | Bëgg nanu exclusivité ngir Senegaal.
M> Then you must buy ten thousand pieces a year. | Alors vous devez acheter dix mille pièces par an. | Su fekkee loolu, war ngeen jënd fukk junni pièce ci at.
C> We accept. Let us sign the agreement. | Nous acceptons. Signons l'accord. | Nu nangu. Nanu signé accord bi.
M> Welcome as our partner. | Bienvenue comme partenaire. | Dalal ak jàmm ni sunu partner.`)
      ]
    }
  };

  BIZ.chine = {
    deb: _P(`
Container | Conteneur | Konteneer
Ship | Navire | Gaal
Port | Port | Port
Customs | Douane | Douane
Invoice | Facture | Factuur
Goods | Marchandise | Marsandiz
Box | Carton | Karton
Weight | Poids | Diisaay
Price | Prix | Njëg
Sample | Échantillon | Échantillon
Supplier | Fournisseur | Fournisseur
Factory | Usine | Uzin
Delivery | Livraison | Livraison
Plane | Avion | Avion
Visa | Visa | Visa
Hotel | Hôtel | Otel
Interpreter | Interprète | Tarjumaan
`),
    inter: _P(`
How many days by sea? | Combien de jours par bateau ? | Ñaata fan ci géej ?
How much per cubic metre? | Combien par mètre cube ? | Ñaata ci metar kib ?
We need the packing list | Il nous faut la liste de colisage | Soxla nanu packing list bi
Where is my container now? | Où est mon conteneur maintenant ? | Fu sama konteneer nekk léegi ?
The factory is in Guangzhou | L'usine est à Canton | Uzin bi ci Guangzhou la nekk
Can you translate for me? | Pouvez-vous traduire pour moi ? | Mën nga ma tekki ?
Please write it in Chinese | Écrivez-le en chinois, s'il vous plaît | Bind ko ci sinwaa, baal ma
How do I pay the supplier? | Comment je paie le fournisseur ? | Naka laa war a fey fournisseur bi ?
I need a bank transfer | J'ai besoin d'un virement bancaire | Soxla naa virmaŋ bank
The exchange rate is high today | Le taux de change est élevé aujourd'hui | Taux bi kawe na tey
Which hotel is near the market? | Quel hôtel est près du marché ? | Ban otel moo jege marse bi ?
How far is the factory? | À quelle distance est l'usine ? | Ñaata la uzin bi sore ?
I need a visa for China | Il me faut un visa pour la Chine | Soxla naa visa ngir Siin
Where can I change money? | Où puis-je changer de l'argent ? | Fan laa mën a soppi xaalis ?
Can you pick me up at the airport? | Pouvez-vous venir me chercher à l'aéroport ? | Mën nga ma dem jël ci àeroporu bi ?
Please send me the tracking number | Envoyez-moi le numéro de suivi | Yónnee ma nimero suivi bi
The goods are ready | La marchandise est prête | Marsandiz bi mat na
`),
    av: _P(`
What are the Incoterms, FOB or CIF? | Quels sont les Incoterms, FOB ou CIF ? | Ban Incoterm la, FOB walla CIF ?
We need the bill of lading | Il nous faut le connaissement | Soxla nanu Bill of Lading bi
Who pays the customs duties? | Qui paie les droits de douane ? | Ana kuy fey droit douane yi ?
The shipment is stuck at customs | L'envoi est bloqué à la douane | Marsandiz bi tëj nañu ko ci douane
We need a certificate of origin | Il nous faut un certificat d'origine | Soxla nanu certifika orijin
Please insure the goods | Assurez la marchandise, s'il vous plaît | Defal assurance ngir marsandiz bi
What is the cost of a full container? | Quel est le coût d'un conteneur complet ? | Ñaata la konteneer bu fees ?
Can we share a container? | Pouvons-nous partager un conteneur ? | Mën nanu bokk konteneer ?
Consolidation takes ten days | Le groupage prend dix jours | Groupage bi day yàgg fukk fan
The delivery time was not respected | Le délai n'a pas été respecté | Bu mujj bi amul bu ñu ko sàmm
We want to visit the factory before paying | Nous voulons visiter l'usine avant de payer | Bëgg nanu ñibbi uzin bi balaa nu fey
Do you accept a letter of credit? | Acceptez-vous le crédit documentaire ? | Ndax nangu nga crédit documentaire ?
Please check the quality before loading | Vérifiez la qualité avant le chargement | Xoolal qualité bi balaa ñu yeb marsandiz bi
We have an exclusive agent in Dakar | Nous avons un agent exclusif à Dakar | Am nanu agent bu exclusif ci Ndakaaru
The goods must arrive before Tabaski | La marchandise doit arriver avant la Tabaski | Marsandiz bi war na agsi balaa Tabaski
Let us start with a trial order | Commençons par une commande d'essai | Nanu tàmbali ak commande d'essai
`),
    sc: {
      deb: [
        _B("🚢 Logistique Chine · À l'aéroport", `
C> Hello, I am looking for a taxi. | Bonjour, je cherche un taxi. | Salaamaalekum, maa ngi wut taksi.
M> Where do you want to go? | Où voulez-vous aller ? | Fan nga bëgg a dem ?
C> To this hotel, please. | À cet hôtel, s'il vous plaît. | Ci otel bii, baal ma.
M> Fifty yuan. | Cinquante yuan. | Juróom-fukk yuan.`),
        _B("🚢 Logistique Chine · À l'hôtel", `
C> I have a room for three nights. | J'ai une chambre pour trois nuits. | Am naa néeg ngir ñett guddi.
M> Passport, please. | Passeport, s'il vous plaît. | Paspoor, baal ma.
C> Here it is. Is there breakfast? | Le voici. Y a-t-il le petit-déjeuner ? | Lii la. Am na ndekki ?
M> Yes, from seven to ten. | Oui, de sept à dix heures. | Waaw, ci juróom-ñaar ba fukk.`),
        _B("🚢 Logistique Chine · Chez le fournisseur", `
C> Hello, I am from Senegal. I want to buy goods. | Bonjour, je viens du Sénégal. Je veux acheter des marchandises. | Salaamaalekum, Senegaal laa jóge. Bëgg naa jënd marsandiz.
M> Welcome. Do you want to see the samples? | Bienvenue. Voulez-vous voir les échantillons ? | Dalal ak jàmm. Bëgg nga gis échantillon yi ?
C> Yes, please. What is the price? | Oui, s'il vous plaît. Quel est le prix ? | Waaw, baal ma. Ñaata la ?
M> Ten yuan each. | Dix yuan pièce. | Fukk yuan ci benn.`),
        _B("🚢 Logistique Chine · Prix et poids", `
C> How much is one carton? | Combien coûte un carton ? | Ñaata la benn karton ?
M> Two hundred yuan. | Deux cents yuan. | Ñaari téeméer yuan.
C> How heavy is it? | Quel est son poids ? | Ñaata la diisaay bi ?
M> Twenty kilos. | Vingt kilos. | Ñaar-fukk kilo.`),
        _B("🚢 Logistique Chine · La livraison", `
C> When is the delivery? | Quand est la livraison ? | Kañ la livraison bi ?
M> In two weeks. | Dans deux semaines. | Ci ñaari ayubés.
C> To the port of Dakar? | Au port de Dakar ? | Ci port bu Ndakaaru ?
M> Yes, to the port of Dakar. | Oui, au port de Dakar. | Waaw, ci port bu Ndakaaru.`)
      ],
      inter: [
        _B("🚢 Logistique Chine · Payer le fournisseur", `
C> How do I pay you? | Comment je vous paie ? | Naka laa war a fey la ?
M> By bank transfer. I will send my account. | Par virement. Je vous envoie mon compte. | Ci virmaŋ bank. Dinaa la yónnee sama kont.
C> Is the exchange rate good today? | Le taux est-il bon aujourd'hui ? | Ndax taux bi baax na tey ?
M> Yes, send before noon. | Oui, envoyez avant midi. | Waaw, yónnee balaa ngoon.`),
        _B("🚢 Logistique Chine · Suivre le conteneur", `
C> Where is my container now? | Où est mon conteneur maintenant ? | Fu sama konteneer nekk léegi ?
M> It left Guangzhou yesterday. | Il a quitté Canton hier. | Dem na Guangzhou démb.
C> Can you send me the tracking number? | Pouvez-vous m'envoyer le numéro de suivi ? | Mën nga ma yónnee nimero suivi bi ?
M> Yes, I will send it by WhatsApp. | Oui, je l'envoie par WhatsApp. | Waaw, dinaa ko yónnee ci WhatsApp.`),
        _B("🚢 Logistique Chine · Le visa", `
C> I need a visa for China. What documents are required? | Il me faut un visa pour la Chine. Quels documents faut-il ? | Soxla naa visa ngir Siin. Ban kayit lañu soxla ?
M> A passport, a photo and an invitation letter. | Un passeport, une photo et une lettre d'invitation. | Paspoor, nataal ak kayit bu woo.
C> How long does it take? | Combien de temps cela prend-il ? | Ñaata fan la di yàgg ?
M> About two weeks. | Environ deux semaines. | Ci diggante ñaari ayubés.`),
        _B("🚢 Logistique Chine · Avec un interprète", `
C> Can you translate for me? I do not speak Chinese. | Pouvez-vous traduire pour moi ? Je ne parle pas chinois. | Mën nga ma tekki ? Mënuma wax sinwaa.
M> Yes, I am your interpreter today. | Oui, je suis votre interprète aujourd'hui. | Waaw, man mooy sa tarjumaan tey.
C> Ask him the price for one thousand pieces. | Demandez-lui le prix pour mille pièces. | Laaj ko njëg bi ngir junni pièce.
M> He says five yuan each. | Il dit cinq yuan pièce. | Mu ni juróom yuan ci benn.`),
        _B("🚢 Logistique Chine · Marchandise prête", `
C> Are the goods ready? | La marchandise est-elle prête ? | Ndax marsandiz bi mat na ?
M> Yes, we pack it today. | Oui, nous l'emballons aujourd'hui. | Waaw, dinanu ko takk tey.
C> Please send photos of the boxes. | Envoyez des photos des cartons. | Yónnee nataal ci karton yi.
M> I will send them in one hour. | Je les envoie dans une heure. | Dinaa leen yónnee ci benn waxtu.`)
      ],
      av: [
        _B("🚢 Logistique Chine · FOB ou CIF", `
C> Is the price FOB or CIF? | Le prix est-il FOB ou CIF ? | Ndax njëg bi FOB la walla CIF ?
M> It is FOB Shenzhen. You pay the sea freight. | C'est FOB Shenzhen. Vous payez le fret maritime. | FOB Shenzhen la. Yaw ngay fey fret ci géej.
C> Can you quote CIF Dakar? | Pouvez-vous coter CIF Dakar ? | Mën nga ma joxe njëg CIF Ndakaaru ?
M> Yes, three hundred dollars more per cubic metre. | Oui, trois cents dollars de plus par mètre cube. | Waaw, ñett téeméer dolaar ci kaw ci metar kib.`),
        _B("🚢 Logistique Chine · Bloqué à la douane", `
C> The container is stuck at customs in Dakar. | Le conteneur est bloqué à la douane de Dakar. | Konteneer bi tëj nañu ko ci douane bu Ndakaaru.
M> Which document is missing? | Quel document manque ? | Ban kayit moo ñàkk ?
C> The certificate of origin. Can you send it today? | Le certificat d'origine. Pouvez-vous l'envoyer aujourd'hui ? | Certifika orijin bi. Mën nga ko yónnee tey ?
M> Yes, I send it by email in one hour. | Oui, je l'envoie par e-mail dans une heure. | Waaw, dinaa ko yónnee ci imeel ci benn waxtu.`),
        _B("🚢 Logistique Chine · Partager un conteneur", `
C> We are small traders. Can we share a container? | Nous sommes de petits commerçants. Pouvons-nous partager un conteneur ? | Ñu di njaay yu ndaw lanu. Mën nanu bokk konteneer ?
M> Yes, consolidation takes ten days. | Oui, le groupage prend dix jours. | Waaw, groupage bi day yàgg fukk fan.
C> What is the price per cubic metre? | Quel est le prix par mètre cube ? | Ñaata la ci metar kib ?
M> One hundred and twenty dollars. | Cent vingt dollars. | Téeméer ak ñaar-fukk dolaar.`),
        _B("🚢 Logistique Chine · Visiter l'usine", `
C> We want to visit the factory before paying. | Nous voulons visiter l'usine avant de payer. | Bëgg nanu ñibbi uzin bi balaa nu fey.
M> You are welcome. When do you arrive? | Vous êtes les bienvenus. Quand arrivez-vous ? | Dalal ak jàmm. Kañ ngeen di agsi ?
C> Next month. Please check the quality before loading. | Le mois prochain. Vérifiez la qualité avant le chargement. | Weer wi ñëw. Xoolal qualité bi balaa ñu yeb marsandiz bi.
M> Of course, we will inspect everything with you. | Bien sûr, nous inspecterons tout avec vous. | Baax na, dinanu xool lépp ak yéen.`),
        _B("🚢 Logistique Chine · Commande d'essai", `
C> Let us start with a trial order. | Commençons par une commande d'essai. | Nanu tàmbali ak commande d'essai.
M> Fine, one twenty-foot container. | Très bien, un conteneur de vingt pieds. | Baax na, benn konteneer bu ñaar-fukk pied.
C> The goods must arrive before Tabaski. | La marchandise doit arriver avant la Tabaski. | Marsandiz bi war na agsi balaa Tabaski.
M> Then we must ship within ten days. | Alors nous devons expédier sous dix jours. | Su fekkee loolu, war nanu yónnee ci diggante fukk fan.`)
      ]
    }
  };

  BIZ.agro = {
    deb: _P(`
Millet | Mil | Suna
Maize | Maïs | Mbaxal
Rice | Riz | Ceeb
Groundnut | Arachide | Gerte
Tomato | Tomate | Tomaat
Onion | Oignon | Sooble
Potato | Pomme de terre | Pataat
Mango | Mangue | Mangoro
Lemon | Citron | Limoŋ
Banana | Banane | Banaan
Fish | Poisson | Jën
Chicken | Poulet | Ganaar
Egg | Oeuf | Nen
Milk | Lait | Meew
Flour | Farine | Farin
Oil | Huile | Diw
Sugar | Sucre | Suukar
`),
    inter: _P(`
Are these vegetables fresh? | Ces légumes sont-ils frais ? | Ndax légum yii bees nañu ?
How much for a bag of rice? | Combien pour un sac de riz ? | Ñaata ngir saak ceeb ?
I buy directly from the farmer | J'achète directement chez l'agriculteur | Dama jënd ci baykat bi ci kanam
When is the harvest? | Quand est la récolte ? | Kañ la ngóob bi ?
The rainy season was good this year | La saison des pluies était bonne cette année | Nawet bi baax na at mii
We dry the mangoes in the sun | Nous séchons les mangues au soleil | Danuy wow mangoro yi ci jant bi
How do you store the onions? | Comment stockez-vous les oignons ? | Naka ngay denc sooble yi ?
I need a cold room for fish | J'ai besoin d'une chambre froide pour le poisson | Soxla naa néeg bu sedd ngir jën
What is the weight of this bag? | Quel est le poids de ce sac ? | Ñaata la diisaay saak bii ?
It must be kept in a dry place | À conserver dans un endroit sec | War na denc ci bérab bu wow
Is the product organic? | Le produit est-il bio ? | Ndax produi bi bio la ?
I sell juice and jam | Je vends du jus et de la confiture | Damay jaay jus ak konfitir
Can I taste it first? | Puis-je goûter d'abord ? | Mën naa ko jéem njëkk ?
How long can it be kept? | Combien de temps peut-il être conservé ? | Ñaata la mën a yàgg ?
Please fill the bag to the top | Remplissez le sac à ras bord | Fees saak bi ba kaw
I want a clean package | Je veux un emballage propre | Bëgg naa emballaas bu set
Delivery is free above fifty thousand | Livraison gratuite au-dessus de cinquante mille | Livraison du fey bu ëpp juróom-fukk junni
`),
    av: _P(`
We process fruits into juice and jam | Nous transformons les fruits en jus et confiture | Danuy soppi meññeef yi ci jus ak konfitir
We need a food safety certificate | Il nous faut un certificat de sécurité alimentaire | Soxla nanu certifika sécurité alimentaire
What is the shelf life of the product? | Quelle est la durée de conservation du produit ? | Ñaata la produi bi mën a yàgg ?
We want to export dried mangoes | Nous voulons exporter des mangues séchées | Bëgg nanu export mangoro yu wow
The buyer wants a label in English | L'acheteur veut une étiquette en anglais | Jëndkat bi bëgg na etiket ci angale
What is the price per ton? | Quel est le prix par tonne ? | Ñaata la ci tonn ?
We sign a supply contract for one year | Nous signons un contrat d'approvisionnement d'un an | Dinanu signé kontra appovisionmaŋ ngir benn at
The quality must be the same every time | La qualité doit être la même à chaque fois | Qualité bi war na bokk saa su nekk
We need cold transport | Il nous faut un transport réfrigéré | Soxla nanu transpoor bu sedd
Half of the harvest is already sold | La moitié de la récolte est déjà vendue | Genn-wàll ci ngóob bi jaay nañu ko
We buy from women's cooperatives | Nous achetons auprès de coopératives de femmes | Danuy jënd ci kooperatif yu jigéen
Can you pay at harvest time? | Pouvez-vous payer à la récolte ? | Mën nga fey ci jamono ngóob bi ?
Payment is thirty days after delivery | Paiement trente jours après livraison | Fey bi fanweer fan la ginnaaw livraison bi
We need a loan to buy the machine | Il nous faut un prêt pour acheter la machine | Soxla nanu am prêt ngir jënd mašin bi
The price drops during the harvest | Le prix baisse pendant la récolte | Njëg bi day wàññiku ci jamono ngóob bi
Let us fix the price before the season | Fixons le prix avant la saison | Nanu dëgmal njëg bi balaa jamono bi
`),
    sc: {
      deb: [
        _B("🌾 Agroalimentaire · Les tomates", `
C> Do you have tomatoes? | Avez-vous des tomates ? | Am nga tomaat ?
M> Yes, they are fresh. | Oui, elles sont fraîches. | Waaw, bees nañu.
C> A kilo, please. How much? | Un kilo, s'il vous plaît. C'est combien ? | Benn kilo, baal ma. Ñaata la ?
M> Five hundred francs. | Cinq cents francs. | Juróom téeméer franc.`),
        _B("🌾 Agroalimentaire · Un sac de riz", `
C> I want a bag of rice. | Je voudrais un sac de riz. | Bëgg naa saak ceeb.
M> Twenty-five kilos or fifty kilos? | Vingt-cinq ou cinquante kilos ? | Ñaar-fukk ak juróom kilo walla juróom-fukk kilo ?
C> Twenty-five kilos. | Vingt-cinq kilos. | Ñaar-fukk ak juróom kilo.
M> Twelve thousand. | Douze mille. | Fukk ak ñaar junni.`),
        _B("🌾 Agroalimentaire · Les oeufs", `
C> Two trays of eggs, please. | Deux plateaux d'oeufs, s'il vous plaît. | Ñaari plato nen, baal ma.
M> Thirty eggs per tray. | Trente oeufs par plateau. | Fanweer nen ci plato bu nekk.
C> How much for two? | Combien pour deux ? | Ñaata ngir ñaar ?
M> Six thousand. | Six mille. | Juróom-benn junni.`),
        _B("🌾 Agroalimentaire · Le poisson", `
C> Is the fish fresh? | Le poisson est-il frais ? | Ndax jën bi bees na ?
M> Yes, it came this morning. | Oui, il est arrivé ce matin. | Waaw, agsi na ci suba.
C> Two kilos, please. | Deux kilos, s'il vous plaît. | Ñaari kilo, baal ma.
M> Four thousand. | Quatre mille. | Ñeent junni.`),
        _B("🌾 Agroalimentaire · Les mangues", `
C> These mangoes are big. How much? | Ces mangues sont grosses. C'est combien ? | Mangoro yii dañuy mag. Ñaata la ?
M> One hundred francs each. | Cent francs pièce. | Téeméer franc ci benn.
C> I take ten. | J'en prends dix. | Dinaa jël fukk.
M> One thousand francs. | Mille francs. | Junni franc.`)
      ],
      inter: [
        _B("🌾 Agroalimentaire · Acheter chez le producteur", `
C> I buy directly from the farmer. How much per bag of onions? | J'achète directement chez l'agriculteur. Combien par sac d'oignons ? | Dama jënd ci baykat bi ci kanam. Ñaata ci saak sooble ?
M> Fifteen thousand a bag, fifty kilos. | Quinze mille le sac, cinquante kilos. | Fukk ak juróom junni ci saak bi, juróom-fukk kilo.
C> If I take twenty bags, what is the price? | Si je prends vingt sacs, quel est le prix ? | Su ma jëlee ñaar-fukk saak, ban njëg la ?
M> Fourteen thousand a bag. | Quatorze mille le sac. | Fukk ak ñeent junni ci saak bi.`),
        _B("🌾 Agroalimentaire · Le stockage", `
C> How do you store the onions? | Comment stockez-vous les oignons ? | Naka ngay denc sooble yi ?
M> In a dry and airy place. | Dans un endroit sec et aéré. | Ci bérab bu wow te am ngelaw.
C> How long can they be kept? | Combien de temps peuvent-ils être conservés ? | Ñaata la mën a yàgg ?
M> Three months, if it does not rain. | Trois mois, s'il ne pleut pas. | Ñett weer, su amul taw.`),
        _B("🌾 Agroalimentaire · La récolte", `
C> When is the harvest this year? | Quand est la récolte cette année ? | Kañ la ngóob bi at mii ?
M> In October, the rainy season was good. | En octobre, la saison des pluies était bonne. | Ci oktoobar, nawet bi baax na.
C> Can I order now and collect later? | Puis-je commander maintenant et récupérer plus tard ? | Mën naa commande léegi te jël ko ginnaaw ?
M> Yes, pay half now. | Oui, payez la moitié maintenant. | Waaw, fey genn-wàll léegi.`),
        _B("🌾 Agroalimentaire · Mangues séchées", `
M> We dry the mangoes in the sun. Do you want to taste? | Nous séchons les mangues au soleil. Voulez-vous goûter ? | Danuy wow mangoro yi ci jant bi. Bëgg nga jéem ?
C> Yes, it is sweet. How much per kilo? | Oui, c'est sucré. Combien le kilo ? | Waaw, dafa suukar. Ñaata ci kilo ?
M> Three thousand a kilo, in a clean package. | Trois mille le kilo, dans un emballage propre. | Ñett junni ci kilo, ci emballaas bu set.
C> I take ten kilos for my shop. | Je prends dix kilos pour ma boutique. | Dinaa jël fukk kilo ngir sama boutik.`),
        _B("🌾 Agroalimentaire · La livraison", `
C> Do you deliver? | Livrez-vous ? | Ndax dangay yónnee ?
M> Yes, delivery is free above fifty thousand. | Oui, la livraison est gratuite au-dessus de cinquante mille. | Waaw, livraison du fey bu ëpp juróom-fukk junni.
C> My order is sixty thousand. | Ma commande est de soixante mille. | Sama commande juróom-benn-fukk junni la.
M> Then it is free. Where do I deliver? | Alors c'est gratuit. Où je livre ? | Su fekkee loolu du fey. Fan laa war a yónnee ?`)
      ],
      av: [
        _B("🌾 Agroalimentaire · Exporter", `
C> We want to export dried mangoes to Europe. | Nous voulons exporter des mangues séchées vers l'Europe. | Bëgg nanu export mangoro yu wow ci Ërop.
M> Do you have a food safety certificate? | Avez-vous un certificat de sécurité alimentaire ? | Am nga certifika sécurité alimentaire ?
C> We are preparing it. The label will be in English. | Nous le préparons. L'étiquette sera en anglais. | Danuy ko waajal. Etiket bi dina nekk ci angale.
M> Good. Send a sample and the price per ton. | Bien. Envoyez un échantillon et le prix par tonne. | Baax na. Yónnee échantillon ak njëg bi ci tonn.`),
        _B("🌾 Agroalimentaire · Contrat d'approvisionnement", `
C> We want a supply contract for one year. | Nous voulons un contrat d'approvisionnement d'un an. | Bëgg nanu kontra appovisionmaŋ ngir benn at.
M> What quantity per month? | Quelle quantité par mois ? | Ban quantité ci weer wu nekk ?
C> Two tons, and the quality must be the same every time. | Deux tonnes, et la qualité doit être la même à chaque fois. | Ñaari tonn, te qualité bi war na bokk saa su nekk.
M> Agreed, payment thirty days after delivery. | D'accord, paiement trente jours après livraison. | Baax na, fey bi fanweer fan ginnaaw livraison bi.`),
        _B("🌾 Agroalimentaire · Coopératives de femmes", `
C> We buy from women's cooperatives. Can you pay at harvest time? | Nous achetons auprès de coopératives de femmes. Pouvez-vous payer à la récolte ? | Danuy jënd ci kooperatif yu jigéen. Mën nga fey ci jamono ngóob bi ?
M> Yes, half at harvest and half after the sale. | Oui, la moitié à la récolte et la moitié après la vente. | Waaw, genn-wàll ci ngóob bi, te genn-wàll ginnaaw jaay bi.
C> That helps the women a lot. | Cela aide beaucoup les femmes. | Loolu dina dimbali jigéen ñi lool.
M> We want fair prices for everyone. | Nous voulons des prix justes pour tous. | Bëgg nanu njëg bu jub ngir ñépp.`),
        _B("🌾 Agroalimentaire · La chaîne du froid", `
C> We need cold transport for the fish. | Il nous faut un transport réfrigéré pour le poisson. | Soxla nanu transpoor bu sedd ngir jën bi.
M> A cold truck costs two hundred thousand per trip. | Un camion frigorifique coûte deux cent mille par voyage. | Kamiyon bu sedd ñaari téeméer junni la ci tukki bu nekk.
C> Can we share the truck with other traders? | Pouvons-nous partager le camion avec d'autres commerçants ? | Mën nanu bokk kamiyon bi ak njaay yeneen ?
M> Yes, that lowers the price for everybody. | Oui, cela baisse le prix pour tous. | Waaw, loolu day wàññi njëg bi ngir ñépp.`),
        _B("🌾 Agroalimentaire · Fixer le prix de saison", `
C> The price drops during the harvest. Let us fix the price before the season. | Le prix baisse pendant la récolte. Fixons le prix avant la saison. | Njëg bi day wàññiku ci jamono ngóob bi. Nanu dëgmal njëg bi balaa jamono bi.
M> What price do you propose? | Quel prix proposez-vous ? | Ban njëg nga di joxe ?
C> Three hundred francs a kilo for the whole season. | Trois cents francs le kilo pour toute la saison. | Ñett téeméer franc ci kilo ngir jamono bi bépp.
M> Okay, let us put it in the contract. | D'accord, mettons-le dans le contrat. | Baax na, nanu ko duggal ci kontra bi.`)
      ]
    }
  };

  BIZ.alpha = {
    deb: _P(`
Letter | Lettre | Araf
Word | Mot | Baat
Number | Chiffre | Limu
Name | Nom | Tur
To read | Lire | Jàng
To write | Écrire | Bind
Pen | Stylo | Stilo
Paper | Papier | Kayit
Book | Livre | Téere
Page | Page | Xët
Alphabet | Alphabet | Alfabe
Vowel | Voyelle | Voyel
Date | Date | Bés
Address | Adresse | Adrees
Phone | Téléphone | Telefon
Signature | Signature | Signatuur
Teacher | Enseignant | Jàngalekat
`),
    inter: _P(`
Can you read this for me? | Pouvez-vous me lire ceci ? | Mën nga ma jàngal lii ?
I can read but I write slowly | Je sais lire mais j'écris lentement | Mën naa jàng waaye damay bind ndank
Please write your name here | Écrivez votre nom ici, s'il vous plaît | Bindal sa tur fii, baal ma
How do you spell this word? | Comment épelle-t-on ce mot ? | Naka lañu di bind baat bii ?
This is the price list | Voici la liste des prix | Lii mooy lisit njëg yi
Read the label on the box | Lisez l'étiquette sur la boîte | Jàngal etiket bi ci kaas bi
I count in my head | Je compte de tête | Damay lim ci sama bopp
Write the amount in numbers and in letters | Écrivez le montant en chiffres et en lettres | Bind xaalis bi ci limu ak araf
Where do I sign? | Où dois-je signer ? | Fu ma war a signé ?
Fill in this form | Remplissez ce formulaire | Fenkal formulaire bii
I need glasses to read | J'ai besoin de lunettes pour lire | Soxla naa lunet ngir jàng
Can you help me write a message? | Pouvez-vous m'aider à écrire un message ? | Mën nga ma dimbali ma bind mesaas ?
Today I learn ten new words | Aujourd'hui j'apprends dix mots nouveaux | Tey dinaa jàng fukk baat yu bees
This number is wrong | Ce chiffre est faux | Limu bii juum na
Read it again, slowly | Relisez-le, lentement | Jàngaat ko, ndank
Write it on the receipt | Écrivez-le sur le reçu | Bind ko ci reçu bi
I want to learn to read in French | Je veux apprendre à lire en français | Bëgg naa jàng ci farañse
`),
    av: _P(`
I teach traders to read and write | J'apprends aux commerçants à lire et à écrire | Damay jàngal njaay yi jàng ak bind
Adults learn faster with real examples | Les adultes apprennent plus vite avec des exemples réels | Mag ñi dañuy jàng gaaw ak misaal yu dëgg
We teach reading with market prices | Nous enseignons la lecture avec les prix du marché | Danuy jàngal jàng ak njëgu marse bi
Write the quantity, the price and the total | Écrivez la quantité, le prix et le total | Bind quantité bi, njëg bi ak total bi
Check that the total is correct | Vérifiez que le total est correct | Xoolal ne total bi jub na
Read a contract before signing | Lisez un contrat avant de signer | Jàng kontra bi balaa nga signé
Do not sign what you do not understand | Ne signez pas ce que vous ne comprenez pas | Bul signé lu nga dégguwul
Ask someone to explain the clauses | Demandez à quelqu'un d'expliquer les clauses | Laaj kenn mu leeral la klos yi
We use phones to practise reading | Nous utilisons les téléphones pour pratiquer la lecture | Danuy jëfandikoo telefon ngir jàng
Voice messages can help beginners | Les messages vocaux peuvent aider les débutants | Mesaas yu baat mën nañu dimbali ñi tàmbali
Everyone has the right to learn | Chacun a le droit d'apprendre | Ku nekk am na droit ci jàng
A signature is a legal promise | Une signature est un engagement légal | Signatuur mooy dige bu am yoon
Keep a copy of every document | Gardez une copie de chaque document | Denc kopi ci dokimaŋ bu nekk
Learning to read opens new doors | Apprendre à lire ouvre de nouvelles portes | Jàng di tijji bunt yu bees
I teach my customers to check their bills | J'apprends à mes clients à vérifier leurs factures | Damay jàngal sama kiliyaŋ yi xool seen factuur
Reading is a form of freedom | Lire est une forme de liberté | Jàng mooy benn xëyu ci sa bopp
`),
    sc: {
      deb: [
        _B("📚 Alphabétisation · Écrire son nom", `
C> What is your name? | Quel est votre nom ? | Noo tudd ?
M> My name is Awa. | Je m'appelle Awa. | Maa ngi tudd Awa.
C> Please write it here. | Écrivez-le ici, s'il vous plaît. | Bindal ko fii, baal ma.
M> A-W-A. | A-W-A. | A-W-A.`),
        _B("📚 Alphabétisation · Écrire les chiffres", `
C> How much is this? | C'est combien ? | Ñaata la ?
M> It is five hundred francs. | C'est cinq cents francs. | Juróom téeméer franc la.
C> Please write the number. | Écrivez le chiffre, s'il vous plaît. | Bindal limu bi, baal ma.
M> Five, zero, zero. | Cinq, zéro, zéro. | Juróom, zero, zero.`),
        _B("📚 Alphabétisation · Lire une étiquette", `
C> Can you read this label? | Pouvez-vous lire cette étiquette ? | Mën nga jàng etiket bii ?
M> Yes, it says sugar. | Oui, c'est écrit sucre. | Waaw, bind nañu suukar.
C> And the price? | Et le prix ? | Te njëg bi ?
M> Seven hundred francs. | Sept cents francs. | Juróom-ñaar téeméer franc.`),
        _B("📚 Alphabétisation · L'adresse", `
C> What is your address? | Quelle est votre adresse ? | Ana sa adrees ?
M> Thiès, near the market. | Thiès, près du marché. | Thiès, ci wetu marse bi.
C> And your phone number? | Et votre numéro de téléphone ? | Te sa nimero telefon ?
M> I will write it for you. | Je vais l'écrire pour vous. | Dinaa la ko bind.`),
        _B("📚 Alphabétisation · La date", `
C> What is the date today? | Quelle est la date aujourd'hui ? | Ban bés la tey ?
M> It is the fifth of October. | C'est le cinq octobre. | Tey, juróom ci weeru oktoobar la.
C> Write the date here. | Écrivez la date ici. | Bindal bés bi fii.
M> Five, ten, twenty twenty-six. | Cinq, dix, deux mille vingt-six. | Juróom, fukk, ñaari junni ak ñaar-fukk ak juróom-benn.`)
      ],
      inter: [
        _B("📚 Alphabétisation · Signer un papier", `
C> Where do I sign? | Où dois-je signer ? | Fu ma war a signé ?
M> Here, at the bottom of the page. | Ici, en bas de la page. | Fii, ci suuf xët bi.
C> Can you read it to me first? | Pouvez-vous me le lire d'abord ? | Mën nga ma ko jàngal njëkk ?
M> Of course, I will read it slowly. | Bien sûr, je vais le lire lentement. | Baax na, dinaa ko jàng ndank.`),
        _B("📚 Alphabétisation · Remplir un formulaire", `
C> Please help me fill this form. | Aidez-moi à remplir ce formulaire, s'il vous plaît. | Dimbali ma ma fenk formulaire bii, baal ma.
M> First, write your first name and surname. | D'abord, écrivez votre prénom et nom. | Njëkk, bindal sa tur ak sa sant.
C> Like this? | Comme ça ? | Noonu la ?
M> Yes, and now the date of birth. | Oui, et maintenant la date de naissance. | Waaw, léegi bés bu nga juddoo.`),
        _B("📚 Alphabétisation · Écrire une facture", `
C> I want to write an invoice. | Je veux écrire une facture. | Bëgg naa bind factuur.
M> First write the product, then the quantity. | D'abord le produit, ensuite la quantité. | Njëkk bind produi bi, ba noppi quantité bi.
C> Then the price and the total? | Ensuite le prix et le total ? | Ba noppi njëg bi ak total bi ?
M> Yes. Check the total twice. | Oui. Vérifiez le total deux fois. | Waaw. Xoolal total bi ñaari yoon.`),
        _B("📚 Alphabétisation · Écrire un message", `
C> Can you help me write a message to my supplier? | Pouvez-vous m'aider à écrire un message à mon fournisseur ? | Mën nga ma dimbali ma bind mesaas ngir sama fournisseur ?
M> Yes. What do you want to say? | Oui. Que voulez-vous dire ? | Waaw. Lan nga bëgg a wax ?
C> I want fifty bags of rice on Monday. | Je veux cinquante sacs de riz lundi. | Bëgg naa juróom-fukk saak ceeb altine.
M> Okay, I write it: hello, I want fifty bags of rice on Monday. | D'accord, je l'écris : bonjour, je veux cinquante sacs de riz lundi. | Baax na, dinaa ko bind: salaamaalekum, bëgg naa juróom-fukk saak ceeb altine.`),
        _B("📚 Alphabétisation · Un chiffre faux", `
C> This number is wrong. | Ce chiffre est faux. | Limu bii juum na.
M> You are right. Read it again, slowly. | Vous avez raison. Relisez-le, lentement. | Dëgg nga. Jàngaat ko, ndank.
C> It is seven hundred, not seventeen hundred. | C'est sept cents, pas mille sept cents. | Juróom-ñaar téeméer la, du junni ak juróom-ñaar téeméer.
M> Thank you, I correct it. | Merci, je corrige. | Jërëjëf, dinaa ko jubbanti.`)
      ],
      av: [
        _B("📚 Alphabétisation · Un cours pour commerçants", `
C> I teach traders to read and write. | J'apprends aux commerçants à lire et à écrire. | Damay jàngal njaay yi jàng ak bind.
M> How do you teach them? | Comment les enseignez-vous ? | Naka ngay ñu jàngal ?
C> With real examples: prices, invoices and messages. | Avec des exemples réels : prix, factures et messages. | Ak misaal yu dëgg: njëg yi, factuur yi ak mesaas yi.
M> That is very useful. Adults learn faster that way. | C'est très utile. Les adultes apprennent plus vite ainsi. | Loolu baax na lool. Mag ñi dañuy jàng gaaw noonu.`),
        _B("📚 Alphabétisation · Lire avant de signer", `
C> Please read this contract before you sign. | Lisez ce contrat avant de signer. | Jàng kontra bii balaa nga signé.
M> I do not understand this clause. | Je ne comprends pas cette clause. | Dégguma klos bii.
C> Ask someone to explain it. Do not sign what you do not understand. | Demandez à quelqu'un de vous l'expliquer. Ne signez pas ce que vous ne comprenez pas. | Laaj kenn mu leeral la ko. Bul signé lu nga dégguwul.
M> You are right. I will come back tomorrow. | Vous avez raison. Je reviens demain. | Dëgg nga. Dinaa dellusi ëllëg.`),
        _B("📚 Alphabétisation · Vérifier ses factures", `
C> I teach my customers to check their bills. | J'apprends à mes clients à vérifier leurs factures. | Damay jàngal sama kiliyaŋ yi xool seen factuur.
M> What should they check? | Que doivent-ils vérifier ? | Lan lañu war a xool ?
C> The quantity, the price and the total. | La quantité, le prix et le total. | Quantité bi, njëg bi ak total bi.
M> And keep a copy of every document. | Et garder une copie de chaque document. | Te denc kopi ci dokimaŋ bu nekk.`),
        _B("📚 Alphabétisation · Apprendre avec le téléphone", `
C> We use phones to practise reading. | Nous utilisons les téléphones pour pratiquer la lecture. | Danuy jëfandikoo telefon ngir jàng.
M> Can voice messages help beginners? | Les messages vocaux peuvent-ils aider les débutants ? | Mesaas yu baat mën nañu dimbali ñi tàmbali ?
C> Yes, they listen first, then they read the text. | Oui, ils écoutent d'abord, puis ils lisent le texte. | Waaw, dinañu déglu njëkk, ba noppi jàng bind bi.
M> That is the way Diisoo works. | C'est comme cela que Diisoo fonctionne. | Noonu la Diisoo di dox.`),
        _B("📚 Alphabétisation · Le droit d'apprendre", `
C> Everyone has the right to learn. | Chacun a le droit d'apprendre. | Ku nekk am na droit ci jàng.
M> Even at fifty years old? | Même à cinquante ans ? | Ba ci juróom-fukk at ?
C> Yes. Learning to read opens new doors. | Oui. Apprendre à lire ouvre de nouvelles portes. | Waaw. Jàng di tijji bunt yu bees.
M> Then I start today. | Alors je commence aujourd'hui. | Su fekkee loolu, dinaa tàmbali tey.`)
      ]
    }
  };

  /* injection business dans les 3 niveaux deja construits par l'app */
  (function injecterBusiness() {
    if (typeof CHINA_TRADE_WOLOF === "undefined" || typeof BUSINESS_DIALOGUES === "undefined") return;
    const map = { deb: "debutant", inter: "intermediaire", av: "avance" };
    Object.keys(BIZ).forEach((cat) => {
      Object.keys(map).forEach((k) => {
        const niv = map[k];
        const mod = CHINA_TRADE_WOLOF[niv];
        if (!mod) return;
        BIZ[cat][k].forEach((v) => { if (!mod.vocab.some((o) => o.en === v.en)) mod.vocab.push(v); });
        if (!BUSINESS_DIALOGUES[niv]) BUSINESS_DIALOGUES[niv] = [];
        BIZ[cat].sc[k].forEach((scene) => scene.forEach((l) => BUSINESS_DIALOGUES[niv].push(l)));
      });
    });
  })();
})();
