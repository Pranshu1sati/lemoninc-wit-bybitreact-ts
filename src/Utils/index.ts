import { z } from "zod";

export const productSchema = z.object({
  name: z.string().nonempty("Product name can't be empty"),
  category: z
    .string({
      required_error: "Category can't be empty",
    })
    .min(1, "Category can't be empty"),
  brand: z.string().nonempty("Brand can't be empty"),
  image: z.string(),
  variants: z
    .array(
      z.object({
        option: z.string().nonempty("Option can't be empty"),
        values: z
          .array(z.string().nonempty())
          .nonempty("Values array must contain at least one value"),
      })
    )
    .min(1, "Please append at least 1 variant"),
  combinations: z
    .array(
      z.object({
        combination: z.string(),
        sku: z.string().nonempty("SKU can't be empty"),
        quantity: z.number().int().min(0, "Minimum quantity is 0"),
        inStock: z.boolean(),
      })
    )
    .min(1, "Please append at least 1 variant")
    .superRefine((combinations, ctx) => {
      const seenSKUs = new Set<string>();
      combinations.forEach((combination, index) => {
        const sku = combination.sku.toLowerCase();
        if (seenSKUs.has(sku)) {
          ctx.addIssue({
            code: "custom", // Specify the issue type as 'custom'
            path: [index, "sku"], // Path to the specific field in the array
            message: "Duplicate SKU",
          });
        } else {
          seenSKUs.add(sku);
        }
      });
    }),
  price: z.number({}).int().min(1, "Price must be greater than or equal to 0"),
  discount: z.object({
    method: z.enum(["%", "$"], {
      required_error: "Discount method is required",
    }),
    value: z
      .number()
      .min(0, "Discount value must be greater than or equal to 0"),
  }),
});


