

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, ILike, Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

  async getAllCategories() {
    const categories = await this.categoryRepository.find();
    return categories.map((category) => ({
      category_id: category.category_id,
      name: category.name,
    }));
  }

  async createProduct(dto: CreateProductDto) {
    if (dto.category_id) {
      const category = await this.categoryRepository.findOne({
        where: { category_id: dto.category_id },
      });
      if (!category) {
        throw new BadRequestException('Invalid category_id');
      }
    }

    const newProduct = this.productRepo.create(dto,);
    const saved = await this.productRepo.save(newProduct);

    return {
      success: true,
      message: 'Product added successfully',
      product_id: saved.product_id,
    };
  }

  // Product Form
async getProductForm() {
  const categories = await this.categoryRepository.find();

  const categoryValues = categories.map((cat) => ({
    category_id: cat.category_id,
    name: cat.name,
  }));

  const fixed_columns = [
    {
      label: 'Product name',
      name: 'product_name',
      is_required: 1,
      type: 'string',
    },
    {
      label: 'Product code',
      name: 'product_code',
      is_required: 1,
      type: 'string',
    },
    {
      label: 'Category',
      name: 'category',
      is_required: 0,
      type: 'dropdown',
      values: categoryValues,
    },
    {
      label: 'Unit',
      name: 'unit',
      is_required: 0,
      type: 'string',
    },
    {
      label: 'Unit Price',
      name: 'unit_price',
      is_required: 0,
      type: 'integer',
    },
    {
      label: 'Tax',
      name: 'tax',
      is_required: 0,
      type: 'numeric',
    },
    {
      label: 'Stock',
      name: 'stock',
      is_required: 0,
      type: 'numeric',
    },
    {
      label: 'Description',
      name: 'description',
      is_required: 0,
      type: 'textarea',
    },
    {
      label: 'Product Thumbnail',
      name: 'thumbnail',
      is_required: 0,
      type: 'file',
      accepted: 'png/jpg/jpeg',
      max_size: '2MB',
    },
  ];

  return {
    success: 'true',
    message: 'Product Form',
    data: {
      fixed_columns,
      custom_columns: [],
    },
  };
}

//Update  Product

async updateProduct(product_id: number, body: UpdateProductDto) {
  const product = await this.productRepo.findOne({ where: { product_id } });
  if (!product) {
    throw new NotFoundException('Product not found');
  }

  // Optional: Validate category_id if passed
  if (body.category_id) {
    const category = await this.categoryRepository.findOne({
      where: { category_id: body.category_id },
    });
    if (!category) {
      throw new BadRequestException('Invalid category_id');
    }
  }

  await this.productRepo.update({ product_id }, body);

  return {
    success: true,
    message: 'Product Update successfully',
  };
}

//Delete Product
async deleteProduct(product_id: number) {
  const product = await this.productRepo.findOne({ where: { product_id } });

  if (!product) {
    throw new NotFoundException('Product not found');
  }

  await this.productRepo.delete({ product_id });

  return {
    success: 'Product Deleted',
  };
}

//Searc Product by Name

async searchProducts(
  search: string = '',
  per_page: number = 10,
  page: number = 1,
) {
  const take = +per_page;
  const skip = (page - 1) * take;

  const query = this.productRepo.createQueryBuilder('product');

  if (search) {
    query.where('product.product_name ILIKE :search', {
      search: `%${search}%`,
    });
  }

  const [products, total] = await query
    .take(take)
    .skip(skip)
    .getManyAndCount();

  const result = products.map((p) => ({
    product_id: p.product_id,
    product_name: p.product_name,
    product_code: p.product_code,
    unit_price: p.unit_price,
    unit: p.unit,
    tax: p.tax,
    category_id: p.category_id,
  }));

  return {
    success: 'true',
    message: 'Product List Fetched',
    info: {
      per_page: take,
      page: +page,
      total,
      is_next: total > skip + take,
    },
    data: result,
  };
}

//View Product by using Product Id
// src/product/product.service.ts

async viewProduct(productId: number) {
  const product = await this.productRepo.findOne({
    where: { product_id: productId },
    relations: ['category'],
  });

  if (!product) {
    throw new NotFoundException('Product not found');
  }

  return {
    success: 'true',
    message: 'Product View',
    data: {
      product_id: product.product_id,
      product_name: product.product_name || '',
      product_code: product.product_code || null,
      category_id: product.category_id || 0,
      category_name: product.category?.name || null,
      unit: product.unit || null,
      unit_price: product.unit_price?.toFixed(2) || '0.00',
      tax: product.tax?.toString() || '0',
      stock: product.stock || 0,
      description: product.description || null,
      picture: product.thumbnail || '',
      created_at: product.created_at?.toISOString().replace('T', ' ').substring(0, 19),
    },
  };
}

async getAllProducts(query: any) {
  const {
    per_page = 10,
    page = 1,
    search,
    category_id,
    start_date,
    end_date
  } = query;

  const skip = (page - 1) * per_page;

  const where: any = {};

  if (search) {
    where.product_name = ILike(`%${search}%`);
  }

  if (category_id) {
    const isValidCategory = await this.categoryRepository.findOneBy({ category_id: category_id });
    if (!isValidCategory) {
      throw new BadRequestException('Invalid Category ID');
    }
    where.category = { category_id: category_id };
  }

  if (start_date || end_date) {
    where.created_at = Between(
      start_date ? new Date(start_date) : new Date('1970-01-01'),
      end_date ? new Date(end_date) : new Date()
    );
  }

  const [products, total] = await this.productRepo.findAndCount({
    where,
    relations: ['category'],
    take: +per_page,
    skip: +skip,
    order: { created_at: 'DESC' }
  });

  const formattedData = products.map(p => ({
    product_id: p.product_id,
    name: p.product_name || '',
    product_code: p.product_code,
    picture: p.thumbnail || '',
    created_at: p.created_at?.toISOString().replace('T', ' ').substring(0, 19)
  }));

  return {
    success: 'true',
    message: 'Products data',
    per_page: +per_page,
    page: +page,
    details: {
      is_prev: page > 1,
      is_next: page * per_page < total,
      total_data: total,
      start: skip + 1,
      end: Math.min(skip + +per_page, total)
    },
    data: formattedData
  };
}


}