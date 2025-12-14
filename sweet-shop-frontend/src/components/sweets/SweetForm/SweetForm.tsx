import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FaUpload, FaImage, FaBox, FaTag, FaDollarSign } from 'react-icons/fa';
import Button from '../../common/Button/Button';
import { useSweets } from '../../../contexts/SweetContext';
import toast from 'react-hot-toast';

const sweetSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  category: z.string().min(2, 'Category must be at least 2 characters'),
  price: z.number().positive('Price must be positive'),
  quantity: z.number().int().nonnegative('Quantity must be non-negative'),
  imageUrl: z.string().url('Invalid URL').optional(),
});

type SweetFormData = z.infer<typeof sweetSchema>;

interface SweetFormProps {
  sweet?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

const SweetForm: React.FC<SweetFormProps> = ({ sweet, onSuccess, onCancel }) => {
  const { addSweet, updateSweet, categories } = useSweets(); // Changed from createSweet to addSweet
  const [isLoading, setIsLoading] = useState(false);
  const [isRestocking, setIsRestocking] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<SweetFormData>({
    resolver: zodResolver(sweetSchema),
    defaultValues: sweet ? {
      name: sweet.name,
      description: sweet.description || '',
      category: sweet.category,
      price: sweet.price,
      quantity: sweet.quantity,
      imageUrl: sweet.imageUrl || '',
    } : {
      name: '',
      description: '',
      category: '',
      price: 0,
      quantity: 0,
      imageUrl: '',
    },
  });

  const quantity = watch('quantity');
  const price = watch('price');
  const totalValue = (quantity || 0) * (price || 0);

  useEffect(() => {
    if (sweet) {
      reset({
        name: sweet.name,
        description: sweet.description || '',
        category: sweet.category,
        price: sweet.price,
        quantity: sweet.quantity,
        imageUrl: sweet.imageUrl || '',
      });
    }
  }, [sweet, reset]);

  const onSubmit = async (data: SweetFormData) => {
    try {
      setIsLoading(true);
      
      if (isRestocking) {
        const updatedQuantity = sweet.quantity + data.quantity;
        await updateSweet(sweet.id, { ...sweet, quantity: updatedQuantity });
        toast.success(`Restocked ${data.quantity} units successfully!`);
      } else if (sweet) {
        await updateSweet(sweet.id, data);
        toast.success('Sweet updated successfully!');
      } else {
        await addSweet(data); // Changed from createSweet to addSweet
        toast.success('Sweet created successfully!');
      }
      
      onSuccess();
    } catch (error) {
      toast.error(sweet ? 'Failed to update sweet' : 'Failed to create sweet');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setValue('imageUrl', imageUrl);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Form Header */}
      <div className="flex justify-between items-center pb-4 border-b">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {isRestocking ? 'Restock Sweet' : sweet ? 'Edit Sweet' : 'Add New Sweet'}
          </h3>
          <p className="text-sm text-gray-600">
            {isRestocking 
              ? 'Add more stock to existing sweet' 
              : 'Fill in the details of your sweet'}
          </p>
        </div>
        {sweet && !isRestocking && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsRestocking(true)}
          >
            Switch to Restock Mode
          </Button>
        )}
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Image
        </label>
        <div className="mt-1 flex items-center">
          <div className="relative w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
            {watch('imageUrl') ? (
              <img
                src={watch('imageUrl')}
                alt="Preview"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <FaImage className="text-3xl text-gray-400" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          <div className="ml-4">
            <Button
              type="button"
              variant="outline"
              icon={FaUpload}
              onClick={() => document.querySelector('input[type="file"]')?.click()}
            >
              Upload Image
            </Button>
            <p className="mt-2 text-xs text-gray-500">
              JPG, PNG or GIF. Max size 2MB.
            </p>
          </div>
        </div>
        {errors.imageUrl && (
          <p className="mt-1 text-sm text-red-600">{errors.imageUrl.message}</p>
        )}
      </div>

      {/* Name and Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sweet Name *
          </label>
          <div className="relative">
            <input
              type="text"
              {...register('name')}
              className="input-field pl-10"
              placeholder="Chocolate Truffle"
              disabled={isRestocking}
            />
            <FaTag className="absolute left-3 top-3 text-gray-400" />
          </div>
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <div className="relative">
            <select
              {...register('category')}
              className="input-field pl-10"
              disabled={isRestocking}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <FaTag className="absolute left-3 top-3 text-gray-400" />
          </div>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>
      </div>

      {/* Price and Quantity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price ($) *
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              min="0"
              {...register('price', { valueAsNumber: true })}
              className="input-field pl-10"
              placeholder="0.00"
              disabled={isRestocking}
            />
            <FaDollarSign className="absolute left-3 top-3 text-gray-400" />
          </div>
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {isRestocking ? 'Restock Quantity *' : 'Initial Quantity *'}
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              {...register('quantity', { valueAsNumber: true })}
              className="input-field pl-10"
              placeholder="0"
            />
            <FaBox className="absolute left-3 top-3 text-gray-400" />
          </div>
          {errors.quantity && (
            <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
          )}
          {sweet && !isRestocking && (
            <p className="mt-1 text-sm text-gray-500">
              Current stock: {sweet.quantity} units
            </p>
          )}
        </div>
      </div>

      {/* Inventory Value */}
      {(quantity > 0 && price > 0) && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-blue-900">Inventory Value</p>
              <p className="text-xs text-blue-700">
                Price × Quantity = Total Value
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-900">
                ${totalValue.toFixed(2)}
              </p>
              <p className="text-sm text-blue-700">
                ${price.toFixed(2)} × {quantity} units
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="input-field"
          placeholder="Describe your sweet..."
          disabled={isRestocking}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (isRestocking) {
              setIsRestocking(false);
            } else {
              onCancel();
            }
          }}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
        >
          {isRestocking ? 'Restock Sweet' : sweet ? 'Update Sweet' : 'Create Sweet'}
        </Button>
      </div>
    </form>
  );
};

export default SweetForm;