import React, { useEffect, useRef, useState } from "react";




function SelectInput(props) {

  const [checked, isChecked] = useState(false);

  const ref = useRef();




  const checkFunction = (e) => {

    isChecked((p) => !p); //p --> data

    if (checked) {

      props.unCheck(e.target.value, props.id);

    } else {

      props.sendData(e.target.value, props.id);

    }

  };




  return (

    <input

      ref={ref}

      type="checkbox"

      onClick={checkFunction}

      checked={checked}

      value={props.val}

    />

  );

}




export default SelectInput;