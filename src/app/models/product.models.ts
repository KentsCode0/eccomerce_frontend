type product = {
    product_id: string,
    product_name: string,
    product_description: string,
    product_image: string,
    product_price: string,
    stock: number,
    created_at: string,
    updated_at: string,
    category_id?: string;
    category?: string;
}

export default product