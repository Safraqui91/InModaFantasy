import React, { useEffect, useState } from "react";
import MultiSelect from "react-multi-select-component";

const ListCheck = ({ dependencias, selected, setSelected }) => {
  /*let options = []; /*[
    { label: "Grapes 🍇", value: "grapes" },
    { label: "Mango 🥭", value: "mango" },
    { label: "Strawberry 🍓", value: "strawberry", disabled: true },
    { label: "Watermelon 🍉", value: "watermelon" },
    { label: "Pear 🍐", value: "pear" },
    { label: "Apple 🍎", value: "apple" },
    { label: "Tangerine 🍊", value: "tangerine" },
    { label: "Pineapple 🍍", value: "pineapple" },
    { label: "Peach 🍑", value: "peach" },
  ];*/

  /*const [selected, setSelected] = useState([]);*/
  const [options, setOptions] = useState([]);
  useEffect(() => {
    console.log('imprimir dependencias')
    console.log(dependencias)
    dependencias.map((val) => {
      options.push({
        label: val.StrNombre,
        value: val.IntIdVinculado,
      });
      setOptions(options);
    });
    console.log(options);
  }, [dependencias]);

  return dependencias.length != 0 ? (
    <div style={{ width: "100%" }}>
      <MultiSelect
        options={options}
        value={selected}
        onChange={setSelected}
        labelledBy={"Seleccionar"}
      />
    </div>
  ) : null;
};

export default ListCheck;
