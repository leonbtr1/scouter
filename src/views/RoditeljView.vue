<script setup>
    import { ref } from 'vue'
    import { useScouterStore } from '@/stores/scouterStore.js'

    const scouterStore = useScouterStore()

    const ime = ref('')
    const prezime = ref('')
    const oib = ref('')
    const datumRodenja = ref('')
    const adresa = ref('')
    const alergije = ref('')
    const lijekovi = ref('')
    const posebnePotrebe = ref('')
    const skupina = ref('poletarci')
    const porukaClanstvo = ref('')

    const odabranoDijete = ref('')
    const odabraniDogadaj = ref('')
    const suglasnost = ref(false)
    const porukaPrijava = ref('')
    const greska = ref(false)

    const prijaviUUdrugu = () => {
        if (ime.value == '' || prezime.value == '' || oib.value == '' || datumRodenja.value == '' || alergije.value == '' || lijekovi.value == '') {
            porukaClanstvo.value = 'Nisu ispunjena sva obavezna polja.'
            return
        }

        scouterStore.dodajDijete({
            ime: ime.value,
            prezime: prezime.value,
            oib: oib.value,
            datumRodenja: datumRodenja.value,
            adresa: adresa.value,
            alergije: alergije.value,
            lijekovi: lijekovi.value,
            posebnePotrebe: posebnePotrebe.value,
            skupina: skupina.value
        })

        porukaClanstvo.value = 'Dijete je prijavljeno. Čeka se odobrenje administratora.'

        ime.value = ''
        prezime.value = ''
        oib.value = ''
        datumRodenja.value = ''
        adresa.value = ''
        alergije.value = ''
        lijekovi.value = ''
        posebnePotrebe.value = ''
    }

    const prijaviNaDogadaj = () => {
        const rezultat = scouterStore.prijaviDijete(odabranoDijete.value, odabraniDogadaj.value, suglasnost.value)

        greska.value = rezultat.ok == false
        porukaPrijava.value = rezultat.poruka

        if (rezultat.ok) {
            odabranoDijete.value = ''
            odabraniDogadaj.value = ''
            suglasnost.value = false
        }
    }
</script>

<template>
    <div class="flex flex-col gap-6 items-center py-8">

        <div class="flex flex-col gap-3 w-2xl bg-white border border-slate-200 p-6 rounded-lg">
            <h2 class="text-xl font-bold">Prijava djeteta u udrugu</h2>
            <hr class="border-slate-200">

            <div class="grid grid-cols-2 gap-3">
                <input v-model="ime" type="text" placeholder="Ime..."
                    class="border border-slate-200 bg-slate-50 py-2 px-4 rounded">
                <input v-model="prezime" type="text" placeholder="Prezime..."
                    class="border border-slate-200 bg-slate-50 py-2 px-4 rounded">
                <input v-model="oib" type="text" placeholder="OIB..."
                    class="border border-slate-200 bg-slate-50 py-2 px-4 rounded">
                <input v-model="datumRodenja" type="date"
                    class="border border-slate-200 bg-slate-50 py-2 px-4 rounded">
                <input v-model="adresa" type="text" placeholder="Adresa..."
                    class="border border-slate-200 bg-slate-50 py-2 px-4 rounded">
                <select v-model="skupina" class="border border-slate-200 bg-slate-50 py-2 px-4 rounded">
                    <option value="poletarci">Poletarci</option>
                    <option value="izvidaci">Izviđači</option>
                    <option value="roveri">Roveri</option>
                </select>
                <input v-model="alergije" type="text" placeholder="Alergije..."
                    class="border border-slate-200 bg-slate-50 py-2 px-4 rounded">
                <input v-model="lijekovi" type="text" placeholder="Lijekovi..."
                    class="border border-slate-200 bg-slate-50 py-2 px-4 rounded">
            </div>

            <input v-model="posebnePotrebe" type="text" placeholder="Posebne potrebe..."
                class="border border-slate-200 bg-slate-50 py-2 px-4 rounded">

            <button @click="prijaviUUdrugu" class="bg-emerald-500 text-emerald-50 font-bold py-2 rounded">
                Prijavi dijete
            </button>

            <span v-if="porukaClanstvo" class="text-sm text-slate-600">{{ porukaClanstvo }}</span>
        </div>

        <div class="flex flex-col gap-2 w-2xl bg-white border border-slate-200 p-6 rounded-lg">
            <h2 class="text-xl font-bold">Moja djeca</h2>
            <hr class="border-slate-200">

            <div v-for="dijete in scouterStore.mojaDjeca()" :key="dijete.id"
                class="flex items-center gap-4 border border-slate-200 bg-slate-50 p-3 rounded">
                <b>{{ dijete.ime }} {{ dijete.prezime }}</b>
                <span class="text-sm text-slate-500">{{ dijete.skupina }}</span>
                <span class="ml-auto text-sm font-bold"
                    :class="dijete.statusClanstva == 'odobreno' ? 'text-emerald-600' : 'text-amber-600'">
                    {{ dijete.statusClanstva }}
                </span>
                <button @click="scouterStore.obrisiDijete(dijete.id)"
                    class="text-rose-700 text-sm px-3 py-1">
                    Obriši
                </button>
            </div>
        </div>

        <div class="flex flex-col gap-3 w-2xl bg-white border border-slate-200 p-6 rounded-lg">
            <h2 class="text-xl font-bold">Prijava na događaj</h2>
            <hr class="border-slate-200">

            <div v-for="dogadaj in scouterStore.aktivniDogadaji()" :key="dogadaj.id"
                class="flex items-center gap-4 border border-slate-200 bg-slate-50 p-3 rounded">
                <div class="flex flex-col">
                    <b>{{ dogadaj.naziv }}</b>
                    <span class="text-sm text-slate-500">{{ dogadaj.datum }} | {{ dogadaj.lokacija }}</span>
                    <span class="text-sm text-slate-500">{{ dogadaj.opis }}</span>
                </div>
                <span class="ml-auto text-sm font-bold">
                    Slobodno: {{ scouterStore.slobodnaMjesta(dogadaj.id) }}
                </span>
            </div>

            <select v-model="odabranoDijete" class="border border-slate-200 bg-slate-50 py-2 px-4 rounded">
                <option value="">Odaberi dijete...</option>
                <option v-for="dijete in scouterStore.mojaDjeca()" :key="dijete.id" :value="dijete.id">
                    {{ dijete.ime }} {{ dijete.prezime }}
                </option>
            </select>

            <select v-model="odabraniDogadaj" class="border border-slate-200 bg-slate-50 py-2 px-4 rounded">
                <option value="">Odaberi događaj...</option>
                <option v-for="dogadaj in scouterStore.aktivniDogadaji()" :key="dogadaj.id" :value="dogadaj.id">
                    {{ dogadaj.naziv }}
                </option>
            </select>

            <label class="flex items-center gap-2 text-sm">
                <input v-model="suglasnost" type="checkbox">
                Dajem roditeljsku suglasnost za sudjelovanje djeteta
            </label>

            <button @click="prijaviNaDogadaj" class="bg-emerald-500 text-emerald-50 font-bold py-2 rounded">
                Prijavi na događaj
            </button>

            <span v-if="porukaPrijava" class="text-sm font-bold"
                :class="greska ? 'text-rose-600' : 'text-emerald-600'">
                {{ porukaPrijava }}
            </span>
        </div>

        <div class="flex flex-col gap-2 w-2xl bg-white border border-slate-200 p-6 rounded-lg">
            <h2 class="text-xl font-bold">Moje prijave</h2>
            <hr class="border-slate-200">

            <div v-for="prijava in scouterStore.mojePrijave()" :key="prijava.id"
                class="flex items-center gap-4 border border-slate-200 bg-slate-50 p-3 rounded">
                <b>{{ scouterStore.dohvatiDogadaj(prijava.dogadajId).naziv }}</b>
                <span class="text-sm text-slate-500">
                    {{ scouterStore.dohvatiDijete(prijava.dijeteId).ime }} | {{ prijava.datumPrijave }}
                </span>
                <span class="ml-auto text-sm font-bold">{{ prijava.statusPrijave }}</span>
            </div>
        </div>

    </div>
</template>