import axios from 'axios';
import React, { useEffect, useState } from 'react';

const useProducts = (id) => {
    const [products, setProducts] = useState({
        optionNum: null,
        options: [],
        product: null,
        conditions: []
    });

    useEffect(() => {
        if (id) {
            axios.get(`${PATH.SERVER}/product/getOneProduct/${id}`)
                .then((res) => {
                    setProducts({
                        optionNum: res.data.optionNum,
                        options: res.data.options,
                        product: res.data.product,
                        conditions: res.data.conditions
                    });
                    console.log(res.data);
                })
                .catch((e) => console.log(e));
        }
    }, [id]);

    // 객체 변환 로직
    const optionNum = products.optionNum;
    const options = products.options;
    const product = options.length > 0 ? options[optionNum].products : "null";
    const conditions = products.conditions;

    return {
        products,
        optionNum,
        options,
        product,
        conditions
    };
};

export default useProducts;