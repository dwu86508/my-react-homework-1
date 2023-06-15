import React, { useState } from 'react';

const ProductList = () => {
  const [products] = useState([
    { id: 1, name: 'Product 1' },
    { id: 2, name: 'Product 2' },
    { id: 3, name: 'Product 3' },
    { id: 4, name: 'Product 4' },
    { id: 5, name: 'Product 5' },
    { id: 6, name: 'Product 6' },
  ]);

  // 将数组分组为每三个商品一组的新数组
  const groupedProducts = [];
  for (let i = 0; i < products.length; i += 3) {
    groupedProducts.push(products.slice(i, i + 3));
  }

  return (

    <div>
       <pre>{JSON.stringify(products, null, 3)}</pre>
    <table>
      <tbody>
        {groupedProducts.map((group, index) => (
          <tr key={index}>
            {group.map(product => (
              <td key={product.id}>{product.name}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    </div>
    
  );
};

export default ProductList;
