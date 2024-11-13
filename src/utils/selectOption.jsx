import  { useState, useEffect } from "react";
import { Config } from "../config/connect";
const api = Config.urlApi;
export function useProvince() {
  const [itemProvince, setItemProvince] = useState([]);
  useEffect(() => {
    const showProvince = async () => {
      try {
        const response = await fetch(api + 'province');
        const jsonData = await response.json();
        setItemProvince(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    showProvince();
  }, []); 

  const data = itemProvince.map(item => ({ label: item.province_name, value: item.province_id }));
  return data;
}

export function useDistrict(id) {
  const [itemDistrict, setItemDistrict] = useState([]);
  useEffect(() => {
    const showDistrict = async () => {
      if (id !== null) {
        try {
          const response = await fetch(api + 'district/pv/' + id);
          const jsonData = await response.json();
          setItemDistrict(jsonData);
      } catch (error) {
          console.error('Error fetching data:', error);
      }
      }
    };
    showDistrict();
  }, [id]);
  const data = itemDistrict.map(item => ({ label: item.district_name, value: item.district_id }));
  return data;
}

export function useOption() {
    const [itemOption, setItemOption] = useState([]);
    useEffect(() => {
      const showOptiongold = async () => {
        try {
          const response = await fetch(api + 'type/option');
          const jsonData = await response.json();
          setItemOption(jsonData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      showOptiongold();
    }, []); 
    const data = itemOption.map(item => ({ label: item.option_name, value: item.option_id}));
    return data;
  }


export function useOptionLm() {
  const [itemOption, setItemOption] = useState([]);
  useEffect(() => {
    const showOptiongold2 = async () => {
      try {
        const response = await fetch(api + 'type/option-lm');
        const jsonData = await response.json();
        setItemOption(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    showOptiongold2();
  }, []); 
  const data = itemOption.map(item => ({ label: item.option_name, value: item.option_id,grams:item.grams }));
  return data;
}

  
    export function useBranch() {
      const [itemBranch, setItembranch] = useState([]);
    
      useEffect(() => {
        const showBranch = async () => {
          try {
            const response = await fetch(api + 'system/');
            const jsonData = await response.json();
            setItembranch(jsonData);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        showBranch();
      }, []); 
  
    const data = itemBranch.map(item => ({ label: item.branch_name, value: item.branch_uuid }));
    return data;
  }
  
export function useType() {
  const [itemType, setItemType] = useState([]);

  useEffect(() => {
    const showTypegold = async () => {
      try {
        const response = await fetch(api + 'type');
        const jsonData = await response.json();
        setItemType(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    showTypegold();
  }, []); 

  const data = itemType.map(item => ({ label: item.typeName, value: item.type_Id }));

  return data;
}


export function useUnite() {
    const [itemUnite, setItemUnite] = useState([]);
    useEffect(() => {
      const showUnitegold = async () => {
        try {
          const response = await fetch(api + 'unite');
          const jsonData = await response.json();
          setItemUnite(jsonData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      showUnitegold();
    }, []); 
  
    const data = itemUnite.map(item => ({ label: item.unite_name, value: item.unite_uuid }));
  
    return data;
  }


export function useTitle() {
    const [itemTile, setItemTile] = useState([]);
    useEffect(() => {
      const showTilegold = async () => {
        try {
          const response = await fetch(api + 'tileps');
          const jsonData = await response.json();
          setItemTile(jsonData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      showTilegold();
    }, []); 
  
    const data = itemTile.map(item => ({ label: item.tile_name, value: item.tile_uuid }));
    return data;
  }


  export function useTitleList() {
    const [itemTile, setItemTile] = useState([]);
    useEffect(() => {
      const showTitleList = async () => {
        try {
          const response = await fetch(api + 'tileps');
          const jsonData = await response.json();
          setItemTile(jsonData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      showTitleList();
    }, []); 
  return itemTile;
  }



export function useZone() {
  const [itemZone, setItemZone] = useState([]);
  useEffect(() => {
    const showZoneSale = async () => {
      try {
        const response = await fetch(api + 'zone');
        const jsonData = await response.json();
        setItemZone(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    showZoneSale();
  }, []); 

  const data = itemZone.map(item => ({ label: item.zone_name, value: item.zone_Id }))
  return data;
}


export function useStaff() {
  const [itemStaff, setItemStaff] = useState([]);
  useEffect(() => {
    const showZoneSale = async () => {
      try {
        const response = await fetch(api + 'staff');
        const jsonData = await response.json();
        setItemStaff(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    showZoneSale();
  }, []); 

  const data = itemStaff.map(item => ({ label: item.first_name+' '+item.last_name, value: item.staff_uuid }));

  return data;
}

//==========


export function useWeight(id) {
  const [itemWeight, setItemWeight] = useState([]);
  useEffect(() => {
    const fetchWeight = async () => {
      if (!id) return; // Exit if id is not valid
        try {
            const response = await fetch(api + 'posd/option/'+id );
            const jsonData = await response.json();
            setItemWeight(jsonData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
   
    fetchWeight();
  }, [id]); 
  const data = itemWeight.map(item => ({ label: item.qty_baht + '/' + item.option_name, value: item.product_uuid }));
  return data;
}



export function useRate() {
  const [itemRate, setItemRate] = useState([]);
  useEffect(() => {
    const fetchRate = async () => {
        try {
            const response = await fetch(api + 'rate/');
            const jsonData = await response.json();
            setItemRate(jsonData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
   
    fetchRate();
  }, []); 
  const data = itemRate.map(item => ({ label: item.currency_name + '(' + item.genus+')', value: item.currency_id }));
  return {option:data,dataList:itemRate};
}