<script lang="ts" setup>
import { toTypedSchema } from "@vee-validate/zod";
import { useForm, useField } from "vee-validate";
import { MomentSchema } from "~/assets/lib/validator";

const { handleSubmit, errors } = useForm({
  validationSchema: toTypedSchema(MomentSchema),
});

const { value: date } = useField("date");
const { value: title } = useField("title");
const { value: description } = useField("description");

const onSubmit = handleSubmit(async (vals) => {
  const res = await useFetch(`/api/moments/`, {
    method: "post",
    body: {
      date: date.value,
      title: title.value,
      details: description.value,
    },
  });
  return navigateTo(`/moments/${res.data.value?.data?._id}`);
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
          type="submit"
          class="min-w-48 py-3 rounded-xl text-white px-2 bg-tertiary border-accent border-[1px]"
        >
          Save
        </button>
      </form>
    </div>
  </div>
</template>
