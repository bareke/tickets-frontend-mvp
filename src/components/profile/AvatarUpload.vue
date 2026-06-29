<template>
  <div class="space-y-3">
    <Label>Avatar</Label>

    <div class="flex items-center gap-4">
      <div
        class="relative flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-muted"
        @click="triggerFileInput"
      >
        <img
          v-if="previewUrl"
          :src="previewUrl"
          alt="Avatar preview"
          class="h-full w-full object-cover"
        />
        <Camera v-else class="h-8 w-8 text-muted-foreground" />
      </div>

      <div class="space-y-1.5">
        <Button type="button" variant="outline" size="sm" @click="triggerFileInput">
          <Upload class="mr-1.5 h-4 w-4" />
          {{ currentAvatarUrl ? 'Cambiar foto' : 'Subir foto' }}
        </Button>
        <p class="text-xs text-muted-foreground">JPG o PNG, máximo 2MB</p>
      </div>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept="image/jpeg,image/png"
      class="hidden"
      @change="onFileSelected"
    />

    <p v-if="errorMsg" class="text-sm text-destructive">{{ errorMsg }}</p>
    <LoadingSpinner v-if="uploading" size="sm" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Camera, Upload } from '@lucide/vue'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'
import { useProfile } from '@/composables/useProfile'

const props = defineProps<{
  currentAvatarUrl?: string
}>()

const emit = defineEmits<{
  uploaded: [avatarUrl: string]
}>()

const { uploadAvatar } = useProfile()

const fileInput = ref<HTMLInputElement | null>(null)
const previewUrl = ref<string | undefined>(props.currentAvatarUrl)
const uploading = ref(false)
const errorMsg = ref('')

watch(() => props.currentAvatarUrl, (val) => {
  previewUrl.value = val
})

function triggerFileInput() {
  fileInput.value?.click()
}

function onFileSelected(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  errorMsg.value = ''

  const allowedTypes = ['image/jpeg', 'image/png']
  if (!allowedTypes.includes(file.type)) {
    errorMsg.value = 'Solo se permiten archivos JPG y PNG'
    return
  }

  if (file.size > 2 * 1024 * 1024) {
    errorMsg.value = 'La imagen no debe superar los 2MB'
    return
  }

  previewUrl.value = URL.createObjectURL(file)

  uploadFile(file)
}

async function uploadFile(file: File) {
  uploading.value = true
  try {
    const res = await uploadAvatar(file)
    previewUrl.value = res.avatar_url
    emit('uploaded', res.avatar_url)
  } catch {
    errorMsg.value = 'Error al subir la imagen'
  } finally {
    uploading.value = false
  }
}
</script>
