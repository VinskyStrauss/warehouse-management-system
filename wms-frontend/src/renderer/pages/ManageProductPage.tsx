import { collection, getDocs, query } from '@firebase/firestore';
import { db } from 'firebase';
import { useEffect, useState } from 'react';
import { IoInformationCircleSharp } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { SingleTableItem } from 'renderer/components/TableComponents/SingleTableItem';
import { TableHeader } from 'renderer/components/TableComponents/TableHeader';
import { TableTitle } from 'renderer/components/TableComponents/TableTitle';
import { Product } from 'renderer/interfaces/Product';
import { PageLayout } from 'renderer/layout/PageLayout';

const newProductInitialState = {
  brand: '',
  motor_type: '',
  part: '',
  available_color: '',
  price: '',
  initial_cost: '',
  warehouse_position: '',
  count: '',
  supplier: '',
};

export const ManageProductPage = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsQuery = query(collection(db, 'product'));
        const querySnapshot = await getDocs(productsQuery);

        const productData: Product[] = [];
        querySnapshot.forEach((theProduct) => {
          const data = theProduct.data() as Product;
          data.id = theProduct.id;
          productData.push(data);
        });

        setProducts(productData);
        console.log(productData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData().catch((error) => {
      console.log(error);
    });
  }, []);

  return (
    <PageLayout>
      <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
        Manage Products
      </h1>
      <div className="w-full h-full bg-transparent overflow-hidden">
        <div className="relative shadow-md sm:rounded-lg overflow-auto h-full flex flex-col justify-between">
          <TableTitle setSearch={setSearch}>
            <button
              type="button"
              className="px-4 py-2 font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 rounded-lg text-sm flex justify-center"
              onClick={() => navigate('/new-product-page')}
            >
              Create new Product
            </button>
          </TableTitle>
          <div className="overflow-y-auto h-full">
            <table className="w-full text-sm text-left text-gray-500">
              <TableHeader>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Selling Price</th>
                <th className="px-4 py-3">Warehouse</th>
                <th className="px-4 py-3"></th>
              </TableHeader>
              <tbody>
                {products.map((product, index) => (
                  <tr key={product.id} className="border-b">
                    <SingleTableItem>
                      {product.brand +
                        ' ' +
                        product.motor_type +
                        ' ' +
                        product.part +
                        ' ' +
                        product.available_color}
                    </SingleTableItem>
                    <SingleTableItem>{product.count}</SingleTableItem>
                    <SingleTableItem>{product.price}</SingleTableItem>
                    <SingleTableItem>
                      {product.warehouse_position === 'gudang_jadi'
                        ? 'Gudang Jadi'
                        : 'Gudang Bahan'}
                    </SingleTableItem>
                    <SingleTableItem>
                      <IoInformationCircleSharp
                        size={25}
                        className="cursor-pointer"
                      />
                    </SingleTableItem>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
