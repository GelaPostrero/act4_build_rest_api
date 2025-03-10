import express, { Request, Response, Router } from "express";
import { UnitProduct, Product } from './product.interface'
import { StatusCodes } from 'http-status-codes'
import * as database from './product.database'

export const productRouter: Router = Router();

productRouter.get('/products', async (req: Request, res: Response) => {
    try {
        const allProducts = await database.findAll();

        if (!allProducts || allProducts.length === 0) { 
            res.status(StatusCodes.NOT_FOUND).json({ msg: 'No products available.' })
            return;
        }

        res.status(StatusCodes.OK).json({ total: allProducts.length, allProducts })
        return;

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error})
        return;
    }
})

productRouter.get('/product/:id', async (req: Request, res: Response) => {
    try {
        const product: UnitProduct | null = await database.findOne(req.params.id);

        if (!product) {
            res.status(StatusCodes.NOT_FOUND).json({ error: 'Product not found' })
            return;
        }

        res.status(StatusCodes.OK).json({ product })
        return;
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error})
        return;
    }
})

productRouter.post('/product', async (req: Request, res: Response) => {
    try {
        const { name, price, quantity, image } = req.body;

        if (!name || !price || !quantity || !image) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: 'Please provide all required parameters.' })
            return;
        }

        const newProduct = await database.create({ ...req.body });
        res.status(StatusCodes.CREATED).json({ newProduct })
        return;
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error})
        return;
    }
});

productRouter.put('/product/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const newProduct: Product = req.body;
        const findProduct = await database.findOne(id);

        if (!findProduct) {
            res.status(StatusCodes.NOT_FOUND).json({ error: 'Product not found' })
            return;
        }

        const updatedProduct = await database.update(id, newProduct);
        res.status(StatusCodes.OK).json({ updatedProduct })
        return;
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error})
        return;
    }
});
productRouter.delete('/product/:id', async (req: Request, res: Response) => {
    try {
        const getProduct = await database.findOne(req.params.id);

        if (!getProduct) {
            res.status(StatusCodes.NOT_FOUND).json({ error: 'Product does not exist' })
            return;
        }

        await database.remove(req.params.id);
        res.status(StatusCodes.OK).json({ msg: 'Product deleted' })
        return;
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error})
        return;
    }
});

