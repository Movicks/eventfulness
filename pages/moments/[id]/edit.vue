<script lang="ts" setup>
import type { Moment } from "~/assets/types";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm, useField } from "vee-validate";
import { formatDate } from "~/assets/lib/dateFormatter";
import { MomentSchema } from "~/assets/lib/validator";



const { params } = useRoute();
const {auth} = useAuth()
const { id } = params;
const data = reactive<{
  loading: boolean;
  error: boolean;
  data: Moment | null;
}>({
  loading: true,
  error: false,
  data: null,
});

try {
  const res = await useFetch(`/api/moments/${id}`);
  data.data = res.data.value?.data as Moment;
} catch (e) {
  console.log(e);
}finally{
  data.loading = false
}



const { handleSubmit, errors } = useForm({
  validationSchema: toTypedSchema(MomentSchema),
});

const dateContent = data.data?.futureDate ? formatDate(data.data?.futureDate) : null;
const { value: date } = useField("date", undefined, {
  initialValue: dateContent || "",
});
const { value: title } = useField("title", undefined, {
  initialValue: data.data?.title || "",
});
const { value: description } = useField("description", undefined, {
  initialValue: data.data?.details || "",
});

const onSubmit = handleSubmit(async (vals) => {
  data.loading = true
  try {
    await $fetch(`/api/moments/${id}/edit`, {
      method: "patch",
      body: {
        date: vals.date,
        title: vals.title,
        details: vals.description,
      },
    });
    auth.user = null
    return navigateTo(`/moments/${id}`);
  } catch (error) {
    console.log(error)
  }finally{
    data.loading = false
  }

});
</script>

<template>
  <div class="w-full min-h-[calc(100vh-10rem)] flex items-center">
    <div class="w-full text-black p-2 max-w-md flex flex-col gap-3">
      <form @submit.prevent="onSubmit" class="flex flex-col gap-5 items-center">
        <!--Date  -->
        <InputComponent
          label="Date in the future"
          type="date"
          HtmlFor="futureDate"
          v-model="date"
          :error="errors.date"
        />
        <!--Title  -->
        <InputComponent
          label="Title"
          HtmlFor="title"
          v-model="title"
          :error="errors.title"
        />
        <!--Description  -->
        <InputComponent
          label="Description"
          HtmlFor="description"
          v-model="description"
          :error="errors.description"
          type="textBox"
        />

        <button
        :disabled="data.loading"
          type="submit"
          class="min-w-48 py-3 rounded-xl text-white px-2 bg-tertiary border-accent border-[1px]"
        >
        Update <LoadingComponent :is-loading="data.loading" />
        </button>
      </form>
    </div>
  </div>
</template>
