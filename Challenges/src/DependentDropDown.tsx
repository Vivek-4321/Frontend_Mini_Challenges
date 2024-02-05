import {useState} from 'react'

function DependentDropDown() {

    const [categories, setCategories] = useState<String>('');
    const [subCategory, setSubCategory] = useState<String>('');
    const [isSubCategoryEnabled, setIsSubCategoryEnabled] = useState<Boolean>(false);

    const category : String [] = ['Fruits', 'Vegetables', 'Dairy'];

    const subCategories = {
        Fruits: ['Apple', 'Banana'],
        Vegetables: ['Carrot', 'Broccoli'],
        Dairy: ['Milk', 'Cheese']
    }

    function handleCategoryChange(value){
        setCategories(value);
        setSubCategory('');
        setIsSubCategoryEnabled(true);
    }

  return (
    <div className='dropdown__container'>
         <select className='select' id='category' onChange={(e) => handleCategoryChange(e.target.value)} value={categories}>
                        {/* <option value="">
                            Fruits
                        </option> */}
                        {
                            category.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))
                        }
                    </select>
                    <br/>
                    <select className='select' id='subCategory' onChange={(e) => setSubCategory(e.target.value)} value={subCategory} disabled={!isSubCategoryEnabled}>
                        {/* <option value="">
                            Select
                        </option> */}
                        {isSubCategoryEnabled &&
                            subCategories[categories].map((subItem) => (
                                <option key={subItem} value={subItem}>
                                    {subItem}
                                </option>
                            ))
                        }
                    </select>
    </div>
  )
}

export default DependentDropDown;