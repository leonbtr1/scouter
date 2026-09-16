import { ref } from 'vue'
import { defineStore } from 'pinia'

const adminEmail = "oip.uljanik@gmail.com"

export const useScouterStore = defineStore('scouterStore', () => {

    const korisnik = ref(null)
    const jeAdmin = ref(false)

    const djeca = ref([])
    const dogadaji = ref([])
    const prijave = ref([])

    const postaviKorisnika = (user) => {
        if (user == null) {
            korisnik.value = null
            jeAdmin.value = false
        } else {
            korisnik.value = { uid: user.uid, email: user.email }
            jeAdmin.value = user.email == adminEmail
        }
    }

    const dodajDijete = (dijete) => {
        djeca.value.push({
            id: Date.now(),
            roditeljId: korisnik.value.uid,
            ime: dijete.ime,
            prezime: dijete.prezime,
            oib: dijete.oib,
            datumRodenja: dijete.datumRodenja,
            adresa: dijete.adresa,
            alergije: dijete.alergije,
            lijekovi: dijete.lijekovi,
            posebnePotrebe: dijete.posebnePotrebe,
            skupina: dijete.skupina,
            statusClanstva: "na cekanju"
        })
    }

    const dohvatiDijete = (dijeteId) => {
        for (let i = 0; i < djeca.value.length; i++) {
            if (djeca.value[i].id == dijeteId) {
                return djeca.value[i]
            }
        }
        return null
    }

    const mojaDjeca = () => {
        const lista = []
        for (let i = 0; i < djeca.value.length; i++) {
            if (djeca.value[i].roditeljId == korisnik.value.uid) {
                lista.push(djeca.value[i])
            }
        }
        return lista
    }

    const djecaPoSkupini = (skupina) => {
        if (skupina == "sve") {
            return djeca.value
        }

        const lista = []
        for (let i = 0; i < djeca.value.length; i++) {
            if (djeca.value[i].skupina == skupina) {
                lista.push(djeca.value[i])
            }
        }
        return lista
    }

    const odobriClanstvo = (dijeteId) => {
        const dijete = dohvatiDijete(dijeteId)
        if (dijete != null) {
            dijete.statusClanstva = "odobreno"
        }
    }

    const dodajDogadaj = (dogadaj) => {
        dogadaji.value.push({
            id: Date.now(),
            naziv: dogadaj.naziv,
            opis: dogadaj.opis,
            datum: dogadaj.datum,
            lokacija: dogadaj.lokacija,
            maksBrojSudionika: dogadaj.maksBrojSudionika,
            arhiviran: false
        })
    }

    const dohvatiDogadaj = (dogadajId) => {
        for (let i = 0; i < dogadaji.value.length; i++) {
            if (dogadaji.value[i].id == dogadajId) {
                return dogadaji.value[i]
            }
        }
        return null
    }

    const urediDogadaj = (dogadajId, noviPodaci) => {
        const dogadaj = dohvatiDogadaj(dogadajId)
        if (dogadaj == null) {
            return
        }

        dogadaj.naziv = noviPodaci.naziv
        dogadaj.opis = noviPodaci.opis
        dogadaj.datum = noviPodaci.datum
        dogadaj.lokacija = noviPodaci.lokacija
        dogadaj.maksBrojSudionika = noviPodaci.maksBrojSudionika
    }

    const obrisiDogadaj = (dogadajId) => {
        for (let i = 0; i < dogadaji.value.length; i++) {
            if (dogadaji.value[i].id == dogadajId) {
                dogadaji.value.splice(i, 1)
                break
            }
        }
    }

    const arhivirajDogadaj = (dogadajId) => {
        const dogadaj = dohvatiDogadaj(dogadajId)
        if (dogadaj != null) {
            dogadaj.arhiviran = true
        }
    }

    const aktivniDogadaji = () => {
        const lista = []
        for (let i = 0; i < dogadaji.value.length; i++) {
            if (dogadaji.value[i].arhiviran == false) {
                lista.push(dogadaji.value[i])
            }
        }
        return lista
    }

    const slobodnaMjesta = (dogadajId) => {
        const dogadaj = dohvatiDogadaj(dogadajId)
        if (dogadaj == null) {
            return 0
        }

        let zauzeto = 0
        for (let i = 0; i < prijave.value.length; i++) {
            if (prijave.value[i].dogadajId == dogadajId && prijave.value[i].statusPrijave != "odbijeno") {
                zauzeto = zauzeto + 1
            }
        }

        return dogadaj.maksBrojSudionika - zauzeto
    }

    const prijaviDijete = (dijeteId, dogadajId, suglasnost) => {
        const dijete = dohvatiDijete(dijeteId)

        if (dijete == null || dohvatiDogadaj(dogadajId) == null) {
            return { ok: false, poruka: "Odaberite dijete i događaj." }
        }

        if (dijete.statusClanstva != "odobreno") {
            return { ok: false, poruka: "Dijete još nije odobreno kao član udruge." }
        }

        if (suglasnost == false) {
            return { ok: false, poruka: "Morate potvrditi roditeljsku suglasnost." }
        }

        for (let i = 0; i < prijave.value.length; i++) {
            if (prijave.value[i].dijeteId == dijeteId && prijave.value[i].dogadajId == dogadajId) {
                return { ok: false, poruka: "Dijete je već prijavljeno na ovaj događaj." }
            }
        }

        if (slobodnaMjesta(dogadajId) <= 0) {
            return { ok: false, poruka: "Nema više slobodnih mjesta." }
        }

        prijave.value.push({
            id: Date.now(),
            dijeteId: dijete.id,
            dogadajId: dogadajId,
            datumPrijave: new Date().toLocaleDateString("hr-HR"),
            statusPrijave: "na cekanju",
            roditeljskaSuglasnost: true
        })

        return { ok: true, poruka: "Prijava je spremljena." }
    }

    const prijaveDogadaja = (dogadajId) => {
        const lista = []
        for (let i = 0; i < prijave.value.length; i++) {
            if (prijave.value[i].dogadajId == dogadajId) {
                lista.push(prijave.value[i])
            }
        }
        return lista
    }

    const mojePrijave = () => {
        const lista = []
        for (let i = 0; i < prijave.value.length; i++) {
            const dijete = dohvatiDijete(prijave.value[i].dijeteId)
            if (dijete != null && dijete.roditeljId == korisnik.value.uid) {
                lista.push(prijave.value[i])
            }
        }
        return lista
    }

    const promijeniStatus = (prijavaId, status) => {
        for (let i = 0; i < prijave.value.length; i++) {
            if (prijave.value[i].id == prijavaId) {
                prijave.value[i].statusPrijave = status
            }
        }
    }

    const izvoziSudionike = (dogadajId) => {
        let tekst = "Ime;Prezime;OIB;Skupina;Alergije;Status\n"

        const lista = prijaveDogadaja(dogadajId)
        for (let i = 0; i < lista.length; i++) {
            const dijete = dohvatiDijete(lista[i].dijeteId)
            tekst = tekst + dijete.ime + ";" + dijete.prezime + ";" + dijete.oib + ";" +
                dijete.skupina + ";" + dijete.alergije + ";" + lista[i].statusPrijave + "\n"
        }

        return tekst
    }

        const izvoziClanove = (skupina) => {
        let tekst = "Ime;Prezime;OIB;Datum rodenja;Skupina;Alergije;Lijekovi;Status\n"

        const lista = djecaPoSkupini(skupina)
        for (let i = 0; i < lista.length; i++) {
            const dijete = lista[i]
            tekst = tekst + dijete.ime + ";" + dijete.prezime + ";" + dijete.oib + ";" +
                dijete.datumRodenja + ";" + dijete.skupina + ";" + dijete.alergije + ";" +
                dijete.lijekovi + ";" + dijete.statusClanstva + "\n"
        }

        return tekst
    }

        const obrisiDijete = (dijeteId) => {
        for (let i = 0; i < djeca.value.length; i++) {
            if (djeca.value[i].id == dijeteId) {
                djeca.value.splice(i, 1)
                break
            }
        }

        for (let i = prijave.value.length - 1; i >= 0; i--) {
            if (prijave.value[i].dijeteId == dijeteId) {
                prijave.value.splice(i, 1)
            }
        }
    }

    return {
        korisnik,
        jeAdmin,
        djeca,
        dogadaji,
        prijave,
        postaviKorisnika,
        dodajDijete,
        dohvatiDijete,
        mojaDjeca,
        djecaPoSkupini,
        odobriClanstvo,
        dodajDogadaj,
        dohvatiDogadaj,
        urediDogadaj,
        obrisiDogadaj,
        arhivirajDogadaj,
        aktivniDogadaji,
        slobodnaMjesta,
        prijaviDijete,
        prijaveDogadaja,
        mojePrijave,
        promijeniStatus,
        izvoziSudionike,
        izvoziClanove,
        obrisiDijete
    }

}, { persist: true })