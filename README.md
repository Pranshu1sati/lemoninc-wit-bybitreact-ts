# Lemon Inc. Inventory with React + TypeScript + React Hook Form + Zod + Zustand + Cloudinary

## Instructions

```bash
  git clone https://github.com/Pranshu1sati/lemoninc-wit-bybitreact-ts.git
  cd lemoninc-wit-bybitreact-ts
  npm i
  npm run dev

```

## Routing Overview

In this app, we use React Router's `Outlet` and a custom `Layout` component to simplify routing and manage shared components like the sidebar. This approach avoids duplicating code across multiple pages, improves maintainability, and provides a seamless user experience.

#### `Layout.tsx`

The `Layout` component serves as a wrapper for pages in the app. It includes:

- **Sidebar:** A navigation menu that can be toggled open or closed.
- **Outlet:** A placeholder for rendering child routes defined in the app's routing configuration.

```tsx
export default Layout;
```

#### `App.tsx`

**Parent Route -> Layout**

- **Child Route -> Element**

### Advantages of Using `Outlet` and `Layout`

#### Simplified DOM Tree

- The `Layout` component centralizes shared components (like the Sidebar), preventing their duplication across individual routes.
- The `Outlet` dynamically renders the appropriate content for the current route, reducing the complexity of the DOM tree.

#### Maintainability

- Changes to shared components (e.g., Sidebar styles or logic) need to be made in only one place, simplifying updates and reducing the risk of inconsistencies.

#### Improved Performance

- The `Outlet` ensures that only the necessary content for the current route is rendered, avoiding unnecessary re-renders of shared components.

#### Enhanced User Experience

- The Sidebar remains consistent across pages, providing a cohesive navigation experience for users.
- The responsive design (with toggling for mobile devices) ensures accessibility on various screen sizes.

````

### Form Management and Validation with React Hook Form and Zod

#### Using React Hook Form and Zod for Validation

React Hook Form simplifies form handling by leveraging uncontrolled components and reducing re-renders. Zod is used for schema-based validation, providing type safety and clear validation rules.

In the Product form schema is defined as:




productSchema = {
  name: non empty string,
  category: non empty string,
  brand: non empty string,
  image: non empty string (image url),
  variants: array of objects with two properties option string and values array of string,
  combinations: is an array of objects of sku instock flag and quantity of the combinations of variants should be at least 1

  price: price is a number which tells the price of object min value is 1,
  discount: is a object that has two properties first is method wh tells the method of discount flat or percentage and second isvalue of the discount,
};
````

#### Dynamic Creation of Combinations

When a user provides variant values, combinations are dynamically generated, `setValues` from React Hook Form ensures touched and values are updated seamlessly.

#### Advantages of React Hook Form and Zod

- **Performance:** Minimal re-renders improve form performance, even for large forms.
- **Type Safety:** Zod integrates directly with TypeScript, ensuring type-safe validation.
- **Dynamic Forms:** Easy handling of dynamic fields like combinations and variants.
- **Custom Validation:** Advanced rules (e.g., duplicate SKU checks) are straightforward with Zod's `superRefine` method.

# Zustand Store Implementation for storage emulation

## Features

- **Categories and Products Management**: Easily add categories and products.
- **Dynamic State Updates**: New data can be pushed to the Zustand store upon form submission.
- **Devtools Integration**: Debug state changes effortlessly.

## Key Points

1. **Form Submission**:
   After form values are validated, the `onSubmit` handler pushes the data to the Zustand store. Although this is not an ideal long-term storage solution, it serves the purpose for this assignment by simplifying data management.

2. **Devtools Middleware**:
   The `devtools` middleware is included to provide an easy way to debug state changes during development .
   I have left the devtools for the the assignment graders convenience zustand state is compatible with redux devtools feel free to check the states.

   ## Advantages of Zustand

- **Simplicity**: No boilerplate code required for managing state.
- **Readability**: The state management logic is concise and easy to follow.
- **Ease of Integration**: Adding middleware like `devtools` is straightforward.

## Limitations

- **Persistence**: Zustand does not provide built-in support for persistent storage unlike TanStack Query. To overcome this, consider integrating with local storage or a backend service.

# Cloudinary Unsigned Uploads

Cloudinary provides a simple API for uploading images using unsigned uploads. Here's an example implementation:

### Code Example

```typescript
await fetch("https://api.cloudinary.com/v1_1/{cloud_name}/image/upload", {
  method: "POST",
  body: data,
})
  .then(async (response) => {
    const json = await response.json();
    setValue("image", json?.url, { shouldValidate: true });
  })
  .catch((error) => {
    console.error("Error uploading image:", error);
  });
```

### Key Steps

1. **Prepare the `data`**:

   - Create a `FormData` object containing the image file and upload preset.

2. **API Endpoint**:

   - Replace `{cloud_name}` with your Cloudinary cloud name in the API URL.

3. **Handle Response**:
   - Parse the JSON response to get the uploaded image URL and update the form state. Storing this value in the zustand store for image url
