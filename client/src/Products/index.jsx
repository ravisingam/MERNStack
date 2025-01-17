import React, { useEffect, useMemo, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useSearchParams } from 'react-router-dom'


import axios from 'axios';
import ProductCard from '../ProductCard';
import ProductFilter from '../ProductFilter';

function Products() {
    const url = 'https://fakestoreapi.com/products';
    const [products, setProducts] = useState([]);
    const [searchParams] = useSearchParams();
    const [activeFilters, setActiveFilters] = useState([])

    console.log([...searchParams.entries()]);

    const searchQuery = searchParams.get('search') || '';
    useEffect(() => {
        // IIFE
        (async () => {
            const data = (await axios.get(url)).data;
            console.log(data);
            setProducts(data);
        })()
    }, [])

    const searchFunction = ({
        title,
        description,
        category
    }) => {
        if (!searchQuery) return true;
        const searchTerm = searchQuery.toLowerCase();
        let found = title.toLowerCase().includes(searchTerm);
        found = found || category.toLowerCase().includes(searchTerm);
        found = found || description.toLowerCase().includes(searchTerm);
        return found
    }


    const filters = [...new Set(products.map(({ category }) => category))]
    console.log({ activeFilters });

    const filterProducts = ({ category }) => {
        if (activeFilters.length === 0) {
            return true;
        }
        return activeFilters.includes(category);
    }

    return (
        <Container fluid>
            <ProductFilter filterList={filters}
                activeFilters={activeFilters}
                setActiveFilters={setActiveFilters}
            />

            <Row>
                {products.filter(filterProducts).filter(searchFunction).map(item => <ProductCard key={item.id} {...item} />)}
            </Row>
        </Container>)
}

export default Products