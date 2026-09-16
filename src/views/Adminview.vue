<script setup>
    import { ref } from 'vue'
    import { useScouterStore } from '@/stores/scouterStore.js'

    const scouterStore = useScouterStore()

    const naziv = ref('')
    const opis = ref('')
    const datum = ref('')
    const lokacija = ref('')
    const maksBrojSudionika = ref(30)
    const uredivaniId = ref(0)

    const filterSkupina = ref('sve')

    const spremiDogadaj = () => {
        if (naziv.value == '' || datum.value == '' || lokacija.value == '' || maksBrojSudionika.value == '' ) {
            return
        }

        const podaci = {
            naziv: naziv.value,
            opis: opis.value,
            datum: datum.value,
            lokacija: lokacija.value,
            maksBrojSudionika: Number(maksBrojSudionika.value)
        }

        if (uredivaniId.value == 0) {
            scouterStore.dodajDogadaj(podaci)
        } else {
            scouterStore.urediDogadaj(uredivaniId.value, podaci)
            uredivaniId.value = 0
        }

        naziv.value = ''
        opis.value = ''
        datum.value = ''
        lokacija.value = ''
        maksBrojSudionika.value = 30
    }

    const pripremiUredivanje = (dogadaj) => {
        uredivaniId.value = dogadaj.id
        naziv.value = dogadaj.naziv
        opis.value = dogadaj.opis
        datum.value = dogadaj.datum
        lokacija.value = dogadaj.lokacija
        maksBrojSudionika.value = dogadaj.maksBrojSudionika
    }

    const preuzmiDatoteku = (tekst, nazivDatoteke) => {
        const datoteka = new Blob(["\ufeff" + tekst], { type: 'text/csv;charset=utf-8;' })

        const link = document.createElement('a')
        link.href = URL.createObjectURL(datoteka)
        link.download = nazivDatoteke
        link.click()
    }

    const preuzmiPopis = (dogadaj) => {
        preuzmiDatoteku(scouterStore.izvoziSudionike(dogadaj.id), 'sudionici-' + dogadaj.naziv + '.csv')
    }

    const preuzmiClanove = () => {
        preuzmiDatoteku(scouterStore.izvoziClanove(filterSkupina.value), 'clanovi-' + filterSkupina.value + '.csv')
    }
</script>

<template>
    <div class="flex flex-col gap-6 items-center py-8">

        <div class="flex flex-col gap-3 w-3xl bg-white border border-slate-200 p-6 rounded-lg">
            <h2 class="text-xl font-bold">
                {{ uredivaniId == 0 ? 'Novi događaj' : 'Uređivanje događaja' }}
            </h2>
            <hr class="border-slate-200">

            <div class="grid grid-cols-2 gap-3">
                <input v-model="naziv" type="text" placeholder="Naziv..."
                    class="border border-slate-200 bg-slate-50 py-2 px-4 rounded">
                <input v-model="lokacija" type="text" placeholder="Lokacija..."
                    class="border border-slate-200 bg-slate-50 py-2 px-4 rounded">
                <input v-model="datum" type="date"
                    class="border border-slate-200 bg-slate-50 py-2 px-4 rounded">
                <input v-model="maksBrojSudionika" type="number" placeholder="Maks. sudionika..."
                    class="border border-slate-200 bg-slate-50 py-2 px-4 rounded">
            </div>

            <input v-model="opis" type="text" placeholder="Opis..."
                class="border border-slate-200 bg-slate-50 py-2 px-4 rounded">

            <button @click="spremiDogadaj" class="bg-emerald-500 text-emerald-50 font-bold py-2 rounded">
                Spremi događaj
            </button>
        </div>

        <div class="flex flex-col gap-4 w-3xl bg-white border border-slate-200 p-6 rounded-lg">
            <h2 class="text-xl font-bold">Događaji i prijave</h2>
            <hr class="border-slate-200">

            <div v-for="dogadaj in scouterStore.dogadaji" :key="dogadaj.id"
                class="flex flex-col gap-2 border border-slate-200 bg-slate-50 p-4 rounded">

                <div class="flex items-center gap-4">
                    <div class="flex flex-col">
                        <b>{{ dogadaj.naziv }}</b>
                        <span class="text-sm text-slate-500">
                            {{ dogadaj.datum }} | {{ dogadaj.lokacija }} |
                            slobodno {{ scouterStore.slobodnaMjesta(dogadaj.id) }}
                            <span v-if="dogadaj.arhiviran"> | arhivirano</span>
                        </span>
                    </div>

                    <div class="ml-auto flex gap-2 text-sm">
                        <button @click="pripremiUredivanje(dogadaj)" class="bg-slate-200 px-3 py-1 rounded">
                            Uredi
                        </button>
                        <button @click="preuzmiPopis(dogadaj)" class="bg-slate-200 px-3 py-1 rounded">
                            Preuzmi popis
                        </button>
                        <button @click="scouterStore.arhivirajDogadaj(dogadaj.id)"
                            class="bg-slate-200 px-3 py-1 rounded">
                            Arhiviraj
                        </button>
                        <button @click="scouterStore.obrisiDogadaj(dogadaj.id)" class="text-rose-700 px-3 py-1">
                            Obriši
                        </button>
                    </div>
                </div>

                <div v-for="prijava in scouterStore.prijaveDogadaja(dogadaj.id)" :key="prijava.id"
                    class="flex items-center gap-4 bg-white border border-slate-200 p-2 rounded text-sm">

                    <span>
                        {{ scouterStore.dohvatiDijete(prijava.dijeteId).ime }}
                        {{ scouterStore.dohvatiDijete(prijava.dijeteId).prezime }}
                    </span>
                    <span class="text-slate-500">
                        alergije: {{ scouterStore.dohvatiDijete(prijava.dijeteId).alergije }}
                    </span>
                    <span class="ml-auto font-bold">{{ prijava.statusPrijave }}</span>

                    <button @click="scouterStore.promijeniStatus(prijava.id, 'odobreno')"
                        class="bg-emerald-500 text-emerald-50 px-3 py-1 rounded">
                        Odobri
                    </button>
                    <button @click="scouterStore.promijeniStatus(prijava.id, 'odbijeno')"
                        class="bg-rose-500 text-rose-50 px-3 py-1 rounded">
                        Odbij
                    </button>
                </div>

            </div>
        </div>

        <div class="flex flex-col gap-3 w-3xl bg-white border border-slate-200 p-6 rounded-lg">
            <h2 class="text-xl font-bold">Članovi udruge</h2>
            <hr class="border-slate-200">

            <div class="flex gap-3">
                <select v-model="filterSkupina" class="w-64 border border-slate-200 bg-slate-50 py-2 px-4 rounded">
                    <option value="sve">Sve skupine</option>
                    <option value="poletarci">Poletarci</option>
                    <option value="izvidaci">Izviđači</option>
                    <option value="roveri">Roveri</option>
                </select>

                <button @click="preuzmiClanove" class="bg-slate-200 font-bold px-4 py-2 rounded">
                    Preuzmi CSV
                </button>
            </div>

            <div v-for="dijete in scouterStore.djecaPoSkupini(filterSkupina)" :key="dijete.id"
                class="flex items-center gap-4 border border-slate-200 bg-slate-50 p-3 rounded">

                <b>{{ dijete.ime }} {{ dijete.prezime }}</b>
                <span class="text-sm text-slate-500">{{ dijete.skupina }} | {{ dijete.datumRodenja }}</span>
                <span class="ml-auto text-sm font-bold">{{ dijete.statusClanstva }}</span>

                <button v-if="dijete.statusClanstva != 'odobreno'"
                    @click="scouterStore.odobriClanstvo(dijete.id)"
                    class="bg-emerald-500 text-emerald-50 text-sm px-3 py-1 rounded">
                    Odobri članstvo
                </button>
                <button @click="scouterStore.obrisiDijete(dijete.id)"
                    class="text-rose-700 text-sm px-3 py-1">
                    Obriši
                </button>
            </div>
        </div>

    </div>
</template>