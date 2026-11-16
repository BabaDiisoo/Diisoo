/* diisoo-tour_hotel-plus.js v1 : Business, Hôtel (mode et beauté) enrichi
   Wolof des phrases existantes complété, +15 phrases, 1 dialogue. Wolof relu par Babacar.
   Desactivable : ?tour_hotel=0 */
(function () {
  "use strict";
  if (window.__diisooHôtelPlus || /[?&]tour_hotel=0/.test(location.search)) return;
  var C, D;
  try { C = CHINA_TRADE_WOLOF; D = BUSINESS_DIALOGUES; } catch (e) { return; }
  if (!C || !C.tour_hotel) return;
  window.__diisooHôtelPlus = true;
  var V = [
{
"niveau": "debutant",
"en": "Do you have a free room tonight?",
"fr": "Vous avez une chambre libre ce soir ?",
"wo": "Ndax am nga benn néeg bu libre tey ci guddi ?"
},
{
"niveau": "debutant",
"en": "How much is one night?",
"fr": "Combien coûte une nuit ?",
"wo": "Ñaata la benn guddi ?"
},
{
"niveau": "debutant",
"en": "Can I see the room?",
"fr": "Je peux voir la chambre ?",
"wo": "Ndax mën naa gis néeg bi ?"
},
{
"niveau": "debutant",
"en": "Is there hot water?",
"fr": "Il y a de l'eau chaude ?",
"wo": "Ndax am na ndox mu tàng ?"
},
{
"niveau": "debutant",
"en": "I need a towel, please.",
"fr": "Il me faut une serviette, s'il vous plaît.",
"wo": "Dama soxla sërwiyet, bu la neexee."
},
{
"niveau": "intermediaire",
"en": "The air conditioning is not working.",
"fr": "La clim ne marche pas.",
"wo": "Klimatisëer bi du dox."
},
{
"niveau": "intermediaire",
"en": "Can I have a late check-out?",
"fr": "Je peux partir plus tard ?",
"wo": "Ndax mën naa génn ci ngoon ?"
},
{
"niveau": "intermediaire",
"en": "Can you wake me up at six?",
"fr": "Vous pouvez me réveiller à six heures ?",
"wo": "Ndax mën nga ma yeew ci juróom-benni waxtu ?"
},
{
"niveau": "intermediaire",
"en": "Where is the swimming pool?",
"fr": "Où est la piscine ?",
"wo": "Fan la pisin bi nekk ?"
},
{
"niveau": "intermediaire",
"en": "Can you call a taxi for me?",
"fr": "Vous pouvez m'appeler un taxi ?",
"wo": "Ndax mën nga ma woo taksi ?"
},
{
"niveau": "avance",
"en": "I booked online, but my name is not on the list.",
"fr": "J'ai réservé en ligne, mais mon nom n'est pas sur la liste.",
"wo": "Reserwe naa ci internet, waaye sama tur nekkul ci list bi."
},
{
"niveau": "avance",
"en": "Can you give me a receipt for my company?",
"fr": "Vous pouvez me faire un reçu pour mon entreprise ?",
"wo": "Ndax mën nga ma defal resi ngir sama àntërpiris ?"
},
{
"niveau": "avance",
"en": "There is too much noise in the next room.",
"fr": "Il y a trop de bruit dans la chambre d'à côté.",
"wo": "Am na coow lu bari ci néeg bi ci wetu sama bos."
},
{
"niveau": "avance",
"en": "I would like to extend my stay by two nights.",
"fr": "Je voudrais prolonger mon séjour de deux nuits.",
"wo": "Dama bëgg a yokk sama fanaan ñaari guddi."
},
{
"niveau": "avance",
"en": "Do you accept payment by card or mobile money?",
"fr": "Vous acceptez la carte ou le mobile money ?",
"wo": "Ndax dangeen di nangu faye kart walla mobile money ?"
}
];
  var L = [
{
"role": "client",
"en": "Excuse me. The air conditioning in my room is not working.",
"fr": "Excusez-moi. La clim de ma chambre ne marche pas.",
"wo": "Baal ma. Klimatisëer bi nekk ci sama néeg du dox.",
"scene": "🛎️ Un problème dans la chambre"
},
{
"role": "receptionniste",
"en": "I am very sorry. Which room are you in?",
"fr": "Je suis vraiment désolé. Vous êtes dans quelle chambre ?",
"wo": "Baal ma lool. Ban néeg nga nekk ?"
},
{
"role": "client",
"en": "Room twelve, on the second floor.",
"fr": "Chambre douze, au deuxième étage.",
"wo": "Néeg fukk ak ñaar, ci ñaareelu etaas bi."
},
{
"role": "receptionniste",
"en": "I will send a technician in ten minutes.",
"fr": "J'envoie un technicien dans dix minutes.",
"wo": "Dinaa yónnee teknisiyeŋ ci fukki simili."
},
{
"role": "client",
"en": "Thank you. Can I also have another towel?",
"fr": "Merci. Je peux aussi avoir une autre serviette ?",
"wo": "Jërëjëf. Ndax mën naa am beneen sërwiyet ?"
},
{
"role": "receptionniste",
"en": "Of course. I will bring it to your room.",
"fr": "Bien sûr. Je vous l'apporte dans votre chambre.",
"wo": "Waaw kay. Dinaa la ko indil ci sa néeg."
},
{
"role": "client",
"en": "If it is not fixed, can I change rooms?",
"fr": "Si ce n'est pas réparé, je peux changer de chambre ?",
"wo": "Su defaruwul, ndax mën naa soppi néeg ?"
},
{
"role": "receptionniste",
"en": "Yes, we have a free room on the third floor.",
"fr": "Oui, nous avons une chambre libre au troisième étage.",
"wo": "Waaw, am nanu benn néeg bu libre ci ñetteelu etaas bi."
}
];
  var FIX = {"Your room is on the second floor": "Sa néeg bi ci ñaareelu etaas bi la nekk.", "Breakfast is from seven to ten": "Ndékki li dafay tàmbali ci juróom-ñaari waxtu ba fukki waxtu.", "The Wi-Fi password is on the card": "Koodu Wi-Fi bi ci kart bi la nekk.", "A single room or a double room?": "Néeg bu benn nit walla néeg bu ñaari nit ?", "The price includes breakfast and taxes": "Njëg li dafa boole ndékki li ak taks yi.", "Check-out is at noon": "Génn gi dafay am ci midi.", "I can store your luggage until the evening": "Mën naa denc sa bagaas yi ba ngoon.", "Would you like air conditioning or a fan?": "Ndax bëgg nga klimatisëer walla wantilatëer ?", "We can arrange an airport transfer for you": "Mën nanu la yóbbu walla jëli la ci aeroport bi.", "Please fill in this registration form": "Bindal sa tur ci fiis bii, bu la neexee.", "I am sorry for the inconvenience. We will change your room immediately.": "Baal ma ci jafe-jafe bi. Dinanu soppi sa néeg bi léegi.", "The hot water is not working. Could you send someone?": "Ndox mu tàng mi du dox. Ndax mën nga yónnee ku ñëw ?", "We are fully booked, but I can offer you a room at our sister hotel.": "Sunu otel bi fees na, waaye mën naa la jox benn néeg ci beneen otel bi nu bokkal.", "For a stay of seven nights, I can offer a ten percent discount.": "Ngir juróom-ñaari guddi, mën naa la wàññil fukki pursaŋ ci njëg li.", "Could you recommend a quiet restaurant nearby?": "Ndax mën nga ma digal benn restoraŋ bu dal bu jege fii ?", "The cancellation is free up to forty-eight hours before arrival.": "Anile bi amul fay ba ñeent-fukk ak juróom-ñetti waxtu balaa ngay agsi.", "I would like to leave a review about your excellent service.": "Dama bëgg a bàyyi benn gis-gis ci sa liggéey bu rafet bi."};
  C.tour_hotel.vocab.forEach(function (v) { if (FIX[v.en]) v.wo = FIX[v.en]; });
  var ORDRE = { debutant: 0, intermediaire: 1, avance: 2 };
  var deja = {}; C.tour_hotel.vocab.forEach(function (v) { deja[v.en] = 1; });
  V.forEach(function (v) { if (!deja[v.en]) { C.tour_hotel.vocab.push(v); deja[v.en] = 1; } });
  var tri = C.tour_hotel.vocab.map(function (v, i) { return [v, i]; });
  tri.sort(function (a, b) { var x = ORDRE[a[0].niveau], y = ORDRE[b[0].niveau]; return (x === y ? a[1] - b[1] : x - y); });
  C.tour_hotel.vocab.length = 0; tri.forEach(function (t) { C.tour_hotel.vocab.push(t[0]); });
  D.tour_hotel = D.tour_hotel || [];
  var vus = {}; D.tour_hotel.forEach(function (l) { vus[l.en] = 1; });
  L.forEach(function (l) { if (!vus[l.en]) D.tour_hotel.push(l); });
})();
