<script setup>
    import { RouterLink, RouterView, useRouter } from 'vue-router'
    import { onAuthStateChanged, signOut } from 'firebase/auth'
    import { auth } from '@/firebase.js'
    import { useScouterStore } from '@/stores/scouterStore.js'

    const scouterStore = useScouterStore()
    const router = useRouter()

    onAuthStateChanged(auth, (trenutniKorisnik) => {
        scouterStore.postaviKorisnika(trenutniKorisnik)
    })

    const odjava = async () => {
        await signOut(auth)
        router.push('/')
    }
</script>

<template>
    <div class="min-h-screen bg-slate-50">

        <nav class="flex items-center gap-4 bg-white border-b border-slate-200 px-8 py-4">
            <h1 class="text-xl font-bold text-emerald-700">Scouter</h1>

            <div v-if="scouterStore.korisnik" class="flex items-center gap-4 ml-auto text-sm">
                <RouterLink to="/roditelj">Moj profil</RouterLink>
                <RouterLink v-if="scouterStore.jeAdmin" to="/admin">Admin panel</RouterLink>
                <span class="text-slate-500">{{ scouterStore.korisnik.email }}</span>
                <button @click="odjava" class="bg-slate-200 px-4 py-2 rounded font-bold">Odjava</button>
            </div>
        </nav>

        <RouterView />

    </div>
</template>