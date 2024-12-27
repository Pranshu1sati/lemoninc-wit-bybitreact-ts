import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
// import {} from useStore
import useStore from "../store";
const AddCategoryDialog = () => {
  const { addCategory } = useStore();
  let [isOpen, setIsOpen] = useState(false);

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful, isSubmitted },
    reset,
  } = useForm<{ name: string }>();

  useEffect(() => {
    if (isSubmitted) reset();
  }, [isSubmitSuccessful]);

  return (
    <>
      <Button
        onClick={open}
        className="flex-1 sm:flex-none px-3 py-2 border border-gray-300 
              rounded-lg text-sm bg-[#E1E7EB] font-semibold text-[#1F8CD0] hover:bg-gray-50 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              transition-colors duration-200 w-1/2"
      >
        Add Category
      </Button>

      <Dialog
        open={isOpen}
        as="div"
        className="relative z-50 focus:outline-none"
        onClose={close}
      >
        <div className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <DialogPanel className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            <DialogTitle
              as="h3"
              className="text-2xl font-semibold text-gray-800 mb-4"
            >
              Add category
            </DialogTitle>
            <form
              className="space-y-4"
              onSubmit={handleSubmit((data) => {
                addCategory(data?.name);
                setIsOpen(false);
              })}
            >
              <div>
                <label
                  htmlFor="category-name"
                  className="block text-[14px] font-normal text-black-700"
                >
                  Category name *
                </label>
                <input
                  type="text"
                  id="category-name"
                  className={` mt-2 w-full p-2 border rounded-lg   ${
                    errors?.name ? "border-red-500" : "border-gray-300 "
                  }`}
                  placeholder="T-shirt"
                  {...register("name", {
                    required: "Category name is required",
                  })}
                />
                {errors?.name && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors?.name?.message}
                  </p>
                )}
              </div>
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={close}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold text-white bg-[#1F8CD0] rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save
                </Button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default AddCategoryDialog;
