import {useState} from 'react';
import './DependedDropDown.css';

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
        <h3>Dependent Drop Down</h3>
        <div className='dropdown__content'>
        <select className='select' id='category' onChange={(e) => handleCategoryChange(e.target.value)} value={categories}>
                        
                        {
                            category.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))
                        }
                    </select>

                    <select className='select' id='subCategory' onChange={(e) => setSubCategory(e.target.value)} value={subCategory} disabled={!isSubCategoryEnabled}>
                        <option className="my-select-menu" value="">
                            Select
                        </option>
                        {isSubCategoryEnabled &&
                            subCategories[categories].map((subItem) => (
                                <option className="option" key={subItem} value={subItem}>
                                    {subItem}
                                </option>
                            ))
                        }
                    </select>
        </div>
         
    </div>
  )
}

export default DependentDropDown;