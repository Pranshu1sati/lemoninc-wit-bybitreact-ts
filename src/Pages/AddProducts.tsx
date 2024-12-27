import { Check, ChevronRight, ImageUp, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import TagInput from "../Components/TagInput";
import { useForm, useFieldArray } from "react-hook-form";
import { Product, Variant } from "../types";
// import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "../Utils";
import { z } from "zod";
import useStore from "../store";
import { useNavigate } from "react-router-dom";

const AddProducts = () => {
  const { categories, addProduct } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(1);
  const [isUploaded, setIsUploaded] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | null>(null);
  // const [inputValue, setInputValue] = useState<string>("");
  // const [values, setValues] = useState<string[]>(["M", "S"]);
  // const [combinationsArr, setcombinationsArr] = useState<string[]>([]);

  const form = useForm<Product>({
    mode: "onChange",
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      category: "Shoes",
      brand: "",
      image: "",
      variants: [
        {
          option: "color",
          values: ["red"],
        },
      ],
      combinations: [],
      price: 1,
      discount: {
        method: "%",
        value: 0,
      },
    },
  });

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState,
    watch,
    trigger,
    clearErrors,
    setError,
    reset,
  } = form;

  const { errors, isValid, isSubmitSuccessful } = formState;

  const { fields, append, remove } = useFieldArray({
    name: "variants",
    control,
    rules: {
      required: "Please append at least 1 item",
    },
  });
  // const combinations = watch("combinations");

  const { fields: combinationFields } = useFieldArray({
    name: "combinations",
    control,
  });

  type Inputs = z.infer<typeof productSchema>;
  type FieldNames = keyof Inputs;

  const variants = watch("variants");
  // console.log(variants);
  // let combi: Array<String> = [];
  const generateCombinations = (variants: Variant[]): void => {
    let combi = variants.reduce(
      (acc, obj) => {
        const currentValues = obj.values || [];
        // Combine existing combinations in `acc` with the current values
        return acc.flatMap((prefix) =>
          currentValues.map((value) => `${prefix ? prefix + "/" : ""}${value}`)
        );
      },
      [""]
    );
    // setcombinationsArr([...combi]);
    setValue(
      "combinations",
      combi.map((combination) => ({
        combination,
        sku: "",
        quantity: 0,
        inStock: false,
      }))
    );
  };

  console.log(errors, "Look Here");
  const next = async (step: number) => {
    let validStep = false;

    switch (step) {
      case 1:
        validStep = await trigger(
          ["name", "category", "brand"] as FieldNames[],
          { shouldFocus: true }
        );

        if (validStep) setStep((prev) => prev + 1);
        return;
      case 2:
        validStep = await trigger("variants", { shouldFocus: true });

        if (validStep) {
          generateCombinations(variants);
          setStep((prev) => prev + 1);
        }
        return;
      case 3:
        validStep = await trigger("combinations", { shouldFocus: true });
        if (validStep) {
          setStep((prev) => prev + 1);
        }
        return;
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      // console.log(file, "file");
      const isValidFormat = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ].includes(file?.type);
      const isValidSize = file.size <= 1024 * 1024 * 5;
      if (!isValidFormat || !isValidSize) {
        setPreview(null); // Clear the preview for invalid files
        // Optionally, set an error message here using `setError`
        if (!isValidFormat) {
          setError("image", {
            message:
              "Invalid file format. Only JPEG, JPG, PNG, and WEBP files are allowed.",
          });
        } else {
          setError("image", { message: "Max image size is 5MB." });
        }
      } else {
        // If the file is valid, set the preview and convert to Base64
        setIsUploading(true);
        setIsUploaded(false);
        setPreview(URL.createObjectURL(file)); // Set the preview

        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "pranshu");
        data.append("cloud_name", "dohleyuec");
        await fetch("https://api.cloudinary.com/v1_1/dohleyuec/image/upload", {
          method: "POST",
          body: data,
        })
          .then(async (data) => {
            setIsUploading(false);
            setIsUploaded(true);
            const json = await data.json();
            // console.log("Data", json);
            // console.log(json?.url);
            // console.log("Data json", JSON.stringify(data));
            setValue("image", json?.url, { shouldValidate: true });
          })
          .catch((error) => {
            console.error("Error uploading image:", error);
            setPreview(null);
            setError(
              "image",
              error?.message ||
                error?.data?.message ||
                "error occurred while uploading, try again"
            );
          });

        clearErrors("image"); // Clear any previous error if file is valid
      }
    }
    if (errors?.image?.message) {
      setPreview(null);
    }
  };

  const clearForm = () => {
    // console.log("Fired");
    reset();
    navigate("/");
  };

  // console.log(errors?.image, preview);
  useEffect(() => {
    reset();
  }, [isSubmitSuccessful]);

  const checkKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") e.preventDefault();
  };

  return (
    <div className="flex w-full flex-row flex-wrap justify-between space-y-3 sm:space-y-0 items-center">
      <form
        onSubmit={handleSubmit((data: Product) => {
          if (isValid) {
            // console.log(isValid);

            addProduct(data);
            navigate("/");
          }
        })}
        onKeyDown={(e) => checkKeyDown(e)}
        className="w-full"
      >
        <div className="w-full flex justify-between">
          <p className="text-2xl sm:ml-8 lg:ml-0 sm:text-2xl text-center md:text-left lg:text-3xl font-semibold text-gray-900 w-screen sm:w-40 whitespace-nowrap">
            Add Products
          </p>

          <div className="flex gap-3 w-full lg:w-[25%] sm:w-2/5 md:justify-end ">
            <button
              onClick={clearForm}
              className="flex-1 sm:flex-none px-3 py-2  border border-gray-300 
            rounded-lg text-sm bg-[#E1E7EB] font-semibold text-[#1F8CD0] hover:bg-gray-50 
            focus:outline-none focus:ring-2 focus:ring-offset-2 
            transition-colors duration-200 w-1/2"
            >
              Cancel
            </button>

            {step < 4 && (
              <button
                // disabled={!isValid}
                className={`flex-1 sm:flex-none px-3 py-2 bg-[#1F8CD0] hover:bg-blue-700 
              text-white rounded-lg text-sm font-semibold  
              focus:outline-none focus:ring-2 focus:ring-offset-2 
              transition-colors duration-200 w-1/2`}
                // type={step === 4 ? "submit" : "button"}
                onClick={() => {
                  // if (step === 2) generateCombinations(variants);
                  // setStep((prev) => prev + 1);
                  next(step);
                }}
              >
                Next
              </button>
            )}
            {step === 4 && (
              <button
                disabled={!isValid}
                className={`flex-1 sm:flex-none px-3 py-2 bg-[#1F8CD0] hover:bg-blue-700 
              text-white rounded-lg text-sm font-semibold  
              focus:outline-none focus:ring-2 focus:ring-offset-2 
              transition-colors duration-200 w-1/2`}
                type="submit"
              >
                Submit
              </button>
            )}
          </div>
        </div>
        <div className="w-full pt-4 mb-8">
          {/* <Productlist categories={categories} products={productsArray} /> */}
          <div className="hidden md:flex items-center justify-start w-full  mb-6">
            <div className="flex items-center ">
              <span
                className={`text-sm font-semibold
               ${step >= 1 ? "text-[#1F8CD0] bg-[#DAEDF9]" : "text-gray-300"}
              px-2 py-1 rounded-md`}
              >
                Description
              </span>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex items-center ">
              <span
                className={`text-sm font-semibold
               ${step >= 2 ? "text-[#1F8CD0] bg-[#DAEDF9]" : "text-gray-300"}
              px-2 py-1 rounded-md`}
              >
                Variants
              </span>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex items-center ">
              <span
                className={`text-sm font-semibold
               ${step >= 3 ? "text-[#1F8CD0] bg-[#DAEDF9]" : "text-gray-300"}
              px-2 py-1 rounded-md`}
              >
                Combinations
              </span>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex items-center ">
              <span
                className={`text-sm font-semibold
               ${step >= 4 ? "text-[#1F8CD0] bg-[#DAEDF9]" : "text-gray-300"}
              px-2 py-1 rounded-md`}
              >
                Price Info
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-1 md:p-4 w-full lg:w-2/3">
          {step === 1 && (
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Description
              </h2>
              <div className="space-y-6 md:w-[80%]">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-[14px] font-normal text-black-700 mb-1"
                  >
                    Product name <span className="text-black">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Name"
                    {...register("name")}
                    className={`w-full p-2 border rounded-lg focus:ring-2   ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="block text-[14px] font-normal text-black-700 mb-1"
                  >
                    Category <span className="text-black-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="category"
                      {...register("category")}
                      //   value={formData.category}
                      //   onChange={handleInputChange}
                      className={`w-full p-2 border appearance-none border-gray-300 rounded-lg   ${
                        errors.category ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </span>
                  </div>
                  {errors.category && (
                    <p className="text-sm text-black-500 mt-1">
                      {errors.category.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="brand"
                    className="block text-[14px] font-normal text-black-700 mb-1"
                  >
                    Brand <span className="text-black-500">*</span>
                  </label>
                  <input
                    id="brand"
                    {...register("brand")}
                    type="text"
                    required
                    placeholder="Nike"
                    //   value={formData.brand}
                    //   onChange={handleInputChange}
                    className={`w-full p-2 border rounded-lg   ${
                      errors.brand ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.brand && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.brand.message}
                    </p>
                  )}
                </div>
                <div className="relative w-1/4">
                  <input
                    type="file"
                    accept="image/jpeg, image/png, image/webp"
                    className={`absolute inset-0 w-full h-full opacity-0 cursor-pointer
                  `}
                    onChange={(e) => {
                      handleFileChange(e); // Custom handler for file change
                    }}
                  />

                  <button
                    className={`inline-flex items-center px-2 py-2 border rounded-lg text-sm font-medium w-full
                  ${
                    isUploaded
                      ? "bg-green-50 border-green-300 text-green-700"
                      : errors?.image?.message
                      ? "text-red-600 border-red-300 hover:bg-red-50 bg-white"
                      : "text-gray-700 border-[#1F8CD0] hover:bg-blue-50 bg-white"
                  } 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 `}
                    // disabled={isUploaded}
                  >
                    {isUploading ? (
                      <span>Uploading...</span>
                    ) : isUploaded ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        <span>Image Uploaded</span>
                      </>
                    ) : errors?.image?.message ? (
                      <span>Failed to upload - Click to retry</span>
                    ) : (
                      <>
                        <ImageUp className="mr-0 md:mr-2 text-[#1F8CD0] size-5" />
                        <span className="text-[#1F8CD0] text-sm font-medium truncate">
                          Upload Image
                        </span>
                      </>
                    )}
                  </button>
                  <div className="relative"></div>
                  {isUploaded && preview && !errors?.image?.message && (
                    <div className="mt-4">
                      <img
                        src={preview}
                        alt="Image Preview"
                        className="w-32 h-32 object-cover rounded"
                      />
                    </div>
                  )}
                  {errors?.image?.message && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.image?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="p-6 form-control">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Variants
              </h2>
              <div
              // className="space-y-6"
              >
                <div className="flex space-x-4">
                  <div className="w-1/4">
                    <p
                      // htmlFor={`variants.${index}.option`}
                      className="block text-[14px] font-normal text-black-700 mb-1"
                    >
                      Option <span className="text-black-500">*</span>
                    </p>
                  </div>
                  <div className="w-3/4">
                    <p className="block text-[14px] font-normal text-black-700 mb-1">
                      Values <span className="text-black-500">*</span>
                    </p>
                  </div>
                </div>
                {/* Variant Rows */}
                {fields?.map((field, index) => (
                  <div
                    className="flex space-x-4 items-start w-full py-2"
                    key={field.id}
                  >
                    {/* Option Input */}
                    <div className="w-1/4">
                      <input
                        id={`variants.${index}.option`}
                        type="text"
                        {...register(`variants.${index}.option`)}
                        className={`w-full p-2 border rounded-lg focus:ring-2  ${
                          errors.variants?.[index]?.option
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.variants?.[index]?.option && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.variants[index].option.message}
                        </p>
                      )}
                    </div>

                    {/* Values Input */}
                    <div className="w-3/4">
                      <div className="flex items-center space-x-2">
                        <TagInput
                          values={variants[index]?.values || []} // Use current values from the watched state
                          setValues={(newValues) =>
                            form.setValue(`variants.${index}.values`, newValues)
                          }
                          error={
                            errors.variants?.[index]?.values ? true : false
                          }
                        />
                        <button
                          type="button"
                          className={` ${
                            fields?.length === 1
                              ? "text-gray-300 "
                              : "text-red-500 hover:text-red-700"
                          }`}
                          onClick={() => remove(index)}
                          disabled={fields?.length === 1 ? true : false}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                      {errors.variants?.[index]?.values && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.variants[index].values.message}
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                {/* Error Message */}
                {fields?.length === 0 && (
                  <div className="text-sm text-red-500">
                    At least one option is required.
                  </div>
                )}

                {/* Add Option Button */}
                <button
                  type="button"
                  className="text-blue-600 hover:underline mt-4 text-sm"
                  onClick={() => append({ option: "", values: [] })} // Add new variant
                >
                  + Add Option
                </button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="p-6 form-control w-full">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Combinations
              </h2>
              {/* <div
              className=""
              > */}
              <div>
                <div className="flex w-full sm:w-4/5 font-semibold mb-2">
                  <div className="flex w-1/2 gap-x-4 justify-items-star">
                    <div className="w-2/5 pr-4"> </div>
                    <div className="w-3/5">
                      <p className="block text-xs md:text-[14px] font-normal text-black-700 mb-1">
                        SKU <span className="text-black-500">*</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex ml-3 w-1/2 gap-x-6">
                    <div className="block text-xs md:text-[14px] font-normal text-black-700 mb-1 mr-4 whitespace-nowrap">
                      In Stock
                    </div>
                    <div className="block text-xs md:text-[14px] font-normal text-black-700 mb-1">
                      {" "}
                      Quantity
                    </div>
                  </div>
                </div>
                {combinationFields.map((field, index) => {
                  const isInStock = watch(`combinations.${index}.inStock`);
                  return (
                    <div key={field.id} className="mb-4">
                      <div className="flex content-center w-full md:w-4/5 ">
                        <div className="flex flex-row space-x-0 w-1/2 items-start h-auto justify-items-star mr-4">
                          <div className="w-2/5  mr-2">
                            <p className="font-normal text-xs md:text-[14px] leading-[16.42px] mt-2.5 text-wrap p-1">
                              {field.combination}
                            </p>
                          </div>
                          <div className="flex flex-col content-center space-y-1 w-3/5">
                            <input
                              {...register(`combinations.${index}.sku`)}
                              placeholder="SKU"
                              className={`w-full p-2 border rounded-lg focus:ring-2  ${
                                errors?.combinations?.[index]?.sku
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                            />
                            {errors?.combinations?.[index]?.sku && (
                              <p className="text-red-500 -mt-6">
                                {errors.combinations[index].sku.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-row ml-3 gap-x-6 w-1/2">
                          <div className="w-1/5 mt-2 mr-4">
                            <label className="cursor-pointer m">
                              <input
                                type="checkbox"
                                {...register(`combinations.${index}.inStock`)}
                                className="sr-only peer"
                              />
                              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-300 dark:peer-focus:ring-gray-800 rounded-full peer dark:bg-gray-300 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-black"></div>
                              {/* <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                              In Stock
                            </span> */}
                            </label>
                          </div>
                          <div className="">
                            <input
                              type="number"
                              {...register(`combinations.${index}.quantity`, {
                                valueAsNumber: true,
                              })}
                              disabled={!isInStock}
                              placeholder="Quantity"
                              className={`w-4/5 p-2 border rounded-lg focus:ring-2   ${
                                errors?.combinations?.[index]?.quantity
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }}`}
                            />
                            {errors?.combinations?.[index]?.quantity && (
                              <p className="text-red-500">
                                {errors.combinations[index]?.quantity?.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* </div> */}
            </div>
          )}
          {step === 4 && (
            <div className="p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Price Info
              </h2>
              <div className="w-full">
                <label
                  htmlFor="price"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Price <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    ₹
                  </span>
                  <input
                    // ref={priceInputRef}
                    id="price"
                    type="number"
                    // value={price}
                    placeholder="12000"
                    {...register("price", {
                      valueAsNumber: true,
                    })}
                    min={0}
                    // onChange={handlePriceChange}
                    className={`w-full pl-8 pr-4 py-2 text-base sm:text-sm border ${
                      errors.price ? "border-red-500" : "border-gray-300"
                    } rounded-md 
                focus:ring-2   outline-none transition-all
                hover:border-gray-400`}
                  />
                </div>
                {errors.price && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.price.message}
                  </p>
                )}
              </div>
              <label
                htmlFor="discount"
                className="block text-sm font-medium text-gray-700"
              >
                Discount <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  // ref={discountInputRef}
                  id="discount"
                  type="number"
                  // value={discount}
                  placeholder="12"
                  // onChange={handleDiscountChange}
                  {...register("discount.value", {
                    valueAsNumber: true,
                  })}
                  className={`w-full flex-1 px-4 py-2 text-base sm:text-sm border rounded-md 
                focus:ring-2   outline-none transition-all
                hover:border-gray-400 ${
                  errors.discount?.value ? "border-red-500" : "border-gray-300"
                }`}
                />

                <div className="flex rounded-md border ">
                  <div className="flex rounded-md border-2 border-gray-200">
                    <label
                      htmlFor="percentage"
                      className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-center transition-colors cursor-pointer 
              ${
                watch("discount.method") === "%"
                  ? "bg-gray-100 text-gray-900"
                  : "bg-white text-gray-300 hover:bg-gray-50"
              }`}
                    >
                      <input
                        id="percentage"
                        type="radio"
                        value="%"
                        {...register("discount.method")}
                        className="sr-only"
                      />
                      %
                    </label>
                    <label
                      htmlFor="flat"
                      className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-center transition-colors cursor-pointer 
              ${
                watch("discount.method") === "$"
                  ? "bg-gray-100 text-gray-900"
                  : "bg-white text-gray-300 hover:bg-gray-50"
              }`}
                    >
                      <input
                        id="flat"
                        type="radio"
                        value="$"
                        {...register("discount.method")}
                        className="sr-only"
                      />
                      $
                    </label>
                  </div>
                  {errors.discount?.type && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors?.discount?.method?.message}
                    </p>
                  )}
                </div>
              </div>
              {errors.discount?.value && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.discount.value.message}
                </p>
              )}
            </div>
          )}
          {/* <DevTool control={control} /> */}
        </div>
      </form>
    </div>
  );
};

export default AddProducts;
