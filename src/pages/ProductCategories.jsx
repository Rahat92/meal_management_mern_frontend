import { useState, useEffect } from 'react';
import { locationPathChanged } from '../features/locationPath';
import { useDispatch } from 'react-redux';
import { useCreateProductCategoryMutation, useDeleteProductCategoryMutation, useGetProductCategoriesQuery, useUpdateProductCategoryMutation } from '../features/productCategory/productCategoryApi';
const ProductCategories = () => {
    const [createProductCategory, { isSuccess }] = useCreateProductCategoryMutation();
    const { data: pCategories, isSuccess: pCategorySuccess } = useGetProductCategoriesQuery();
    const [updateProductCategory, { isSuccess: updateProductCategorySuccess }] = useUpdateProductCategoryMutation()
    const [deleteProductCategory, { isSuccess: deleteProductCategorySuccess, isLoading: deleteProductCategoryIsLoading, isError: deleteProductCategoryIsError }] = useDeleteProductCategoryMutation()
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({ name: '', bnName: '' });
    const [editingId, setEditingId] = useState(null);
    const [editingName, setEditingName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch categories on component mount
    const dispatch = useDispatch();
    useEffect(() => {
        if (isSuccess) {
            alert('A New Category created successfully')
        }
        if (deleteProductCategorySuccess) {
            alert('Delete a category successfully')
        }
    }, [isSuccess, deleteProductCategorySuccess])
    useEffect(() => {
        if (isSuccess || deleteProductCategorySuccess) {
            setCategories([...pCategories])
        }
    }, [pCategories, deleteProductCategorySuccess])

    useEffect(() => {
        dispatch(locationPathChanged(window.location.pathname));
    }, []);
    useEffect(() => {
        fetchCategories()
    }, [pCategorySuccess])
    const fetchCategories = async () => {
        try {
            // setLoading(true);
            // const response = await fetch('/api/categories');
            // const data = await response.json();
            // setCategories(getProductCategories);
            // setError('');
            if (pCategories?.length > 0) {
                setCategories(pCategories)
            }
        } catch (err) {
            setError('Failed to fetch categories');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategory.name.trim() || !newCategory.bnName.trim()) return;
        try {
            createProductCategory({ name: newCategory.name, bnName: newCategory.bnName })
        } catch (err) {
            setError('Failed to add category');
            console.error(err);
        }
    };

    // const handleAddCategory = async (e) => {
    //     e.preventDefault();
    //     if (!newCategory.name.trim() || !newCategory.bnName.trim()) return;

    //     await yourApiCall({ name: newCategory.name, bnName: newCategory.bnName });

    //     setNewCategory({ name: '', bnName: '' }); // Reset both fields
    // };

    const handleUpdateCategory = async (id) => {
        if (!editingName.trim()) return;

        try {
            // const response = await fetch(`/api/categories/${id}`, {
            //     method: 'PUT',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ name: editingName })
            // });

            // if (response.ok) {
            //     const data = await response.json();
            //     setCategories(categories.map(cat => cat._id === id ? data : cat));
            //     setEditingId(null);
            //     setEditingName('');
            //     setError('');
            // } else {
            //     const errorData = await response.json();
            //     setError(errorData.message || 'Failed to update category');
            // }
            console.log(id, editingName)
            updateProductCategory({ id, data: { name: editingName } })
        } catch (err) {
            setError('Failed to update category');
            console.error(err);
        }
    };
    useEffect(() => {
        if (updateProductCategorySuccess) {
            alert('Update a category successfully')
        }
    }, [updateProductCategorySuccess])
    const handleDeleteCategory = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;

        try {
            // const response = await fetch(`/api/categories/${id}`, {
            //     method: 'DELETE'
            // });
            deleteProductCategory(id)

            // if (response.ok) {
            //     setCategories(categories.filter(cat => cat._id !== id));
            //     setError('');
            // } else {
            //     setError('Failed to delete category');
            // }
        } catch (err) {
            setError('Failed to delete category');
            console.error(err);
        }
    };

    const startEdit = (category) => {
        setEditingId(category._id);
        setEditingName(category.name);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditingName('');
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Product Categories</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* Add Category Form */}
            <form onSubmit={handleAddCategory} className="mb-8">
                <div className="flex flex-col gap-3 text-gray-500">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newCategory.name}
                            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                            placeholder="Enter category name (English)"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            value={newCategory.bnName}
                            onChange={(e) => setNewCategory({ ...newCategory, bnName: e.target.value })}
                            placeholder="বিভাগের নাম লিখুন (বাংলা)"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                        >
                            Add Category
                        </button>
                    </div>
                </div>
            </form>

            {/* Categories List */}
            {loading ? (
                <div className="text-center py-8">Loading...</div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Created At
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {categories.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                                        No categories found. Add your first category above.
                                    </td>
                                </tr>
                            ) : (
                                categories.map((category) => (
                                    <tr key={category._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            {editingId === category._id ? (
                                                <input
                                                    type="text"
                                                    value={editingName}
                                                    onChange={(e) => setEditingName(e.target.value)}
                                                    className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    autoFocus
                                                />
                                            ) : (
                                                <span className="text-sm font-medium text-gray-900">
                                                    {category.name}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(category.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-medium">
                                            {editingId === category._id ? (
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleUpdateCategory(category._id)}
                                                        className="text-green-600 hover:text-green-900"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={cancelEdit}
                                                        className="text-gray-600 hover:text-gray-900"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => startEdit(category)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteCategory(category._id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ProductCategories;