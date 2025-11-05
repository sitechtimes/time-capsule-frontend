//for admin to view students - should i even be doing it this way???? when would i even store this

export const useStudentStore = defineStore("studentStore", () => {
  const student = ref<Student>();
  return {
    student
  };
});
