<script setup>
    import { ref } from 'vue'
    import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
    import { auth } from '@/firebase.js'
    import { useRouter } from 'vue-router'

    const router = useRouter()

    const email = ref('')
    const lozinka = ref('')
    const poruka = ref('')

    const prijava = async () => {
        try {
            await signInWithEmailAndPassword(auth, email.value, lozinka.value)
            router.push('/roditelj')
        } catch (error) {
            poruka.value = 'Neuspješna prijava: ' + error.message
        }
    }

    const registracija = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email.value, lozinka.value)
            router.push('/roditelj')
        } catch (error) {
            poruka.value = 'Greška pri registraciji: ' + error.message
        }
    }
</script>

<template>
    <div class="flex justify-center py-16">
        <div class="flex flex-col gap-4 w-96 bg-white border border-slate-200 p-8 rounded-lg">

            <h2 class="text-2xl font-bold">Prijava roditelja</h2>
            <hr class="border-slate-200">

            <input v-model="email" type="email" placeholder="Email..."
                class="border border-slate-200 bg-slate-50 py-2 px-4 rounded">

            <input v-model="lozinka" type="password" placeholder="Lozinka..."
                class="border border-slate-200 bg-slate-50 py-2 px-4 rounded">

            <button @click="prijava" class="bg-emerald-500 text-emerald-50 font-bold py-2 rounded">
                Prijavi se
            </button>

            <button @click="registracija" class="bg-slate-200 font-bold py-2 rounded">
                Registriraj se
            </button>

            <span v-if="poruka" class="text-rose-600 text-sm">{{ poruka }}</span>

        </div>
    </div>
</template>