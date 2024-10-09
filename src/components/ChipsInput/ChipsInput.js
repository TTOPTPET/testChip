import React, { useState, useEffect, useRef } from "react";
import { ReactComponent as DeleteIcon } from "../../assets/cross.svg";

function ChipsInput({value, onChange}) {
  const [text, setText] = useState();
  const [chips, setChips] = useState([]);
  const [validationError, setValidationError] = useState("");
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const editableRef = useRef(null);

  function splitByCommasOutsideQuotes(string) {
    const regex = /,(?=(?:[^"]*"[^"]*")*[^"]*$)/;
    if (string) {
      const result = string.split(regex).map(item => item.trim()).filter(item => item !== "");
      return result;
    } else {
      return []
    }
  }

  useEffect(() => {
    setChips(splitByCommasOutsideQuotes(value));
  }, [value]);

  function removeChip(chipToRemove) {
    const newChips = chips.filter((chip) => chip !== chipToRemove);
    onChange(newChips.join(', ') );
  }

  const addChip = (text) => {
    if (text.trim()) {
      const newChips = [...chips, text.trim()];
      setChips(newChips);
      onChange(newChips.join(', '));
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    const lastChar = value[value.length - 1];

    if (lastChar === '"') {
      setIsQuoteOpen(!isQuoteOpen);
    }

    if (lastChar === ',' && !isQuoteOpen) {
      if (chips.includes(text)) {
        return setValidationError("Такой чипс уже есть!");
      }
      addChip(text);
      setText('');
    } else {
      setValidationError("");
      setText(value);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === ',' || !text) return;
    if (e.key === ',' ) {
      addChip(text);
      setText("");
      setValidationError("");
    };
  };

  const handleBlur = () => {
    if (isQuoteOpen) {
      setValidationError('Ошибка: незакрытая кавычка.');
    } else if (text.trim()) {
      addChip(text);
      setText('');
    }
  };

  const handleEditChip = (index) => {
    setEditingIndex(index);
    setTimeout(() => {
      if (editableRef.current) {
        editableRef.current.focus();
      }
    }, 0);
  };

  const handleEditBlur = () => {
    if (editableRef.current) {
      const editedText = editableRef.current.textContent.trim(); 
      if (editedText) {
        const newChips = [...chips];
        newChips[editingIndex] = editedText;
        setChips(newChips);
        onChange(newChips.join(', '));
      }
    }
    setEditingIndex(null);
  };

  const handleEditKeyDown = (e, index) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleEditBlur();
    }
    if (e.key === 'Backspace' || e.key === 'Delete') {
      const currentText = editableRef.current.textContent.trim();
      if (currentText.length <= 1) {
        e.preventDefault();
        removeChipAtIndex(index);
      }
    }
  };

  const removeChipAtIndex = (index) => {
    const newChips = [...chips];
    newChips.splice(index, 1);
    setChips(newChips);
    onChange(newChips.join(', '));
  };

  return (
    <div className="input_wrapper">
      <div className="input_container">
        <ul className="input_chips">
          {chips.map((chip, index) => (
            <li key={chip} className="input_chips_item">
              {editingIndex === index ? (
                <span
                  ref={editableRef}
                  contentEditable={true}
                  className="input_chips_item__editable"
                  onBlur={handleEditBlur}
                  onKeyDown={(e) => handleEditKeyDown(e, index)}
                >
                  {chip}
                </span>
              ) : (
                <span onClick={() => handleEditChip(index)}>{chip}</span>
              )}
              <DeleteIcon onClick={() => removeChip(chip)} tabIndex="0" className="input_chips_item__icon"/>
            </li>
          ))}
        </ul>
        <input
          type="text"
          placeholder="Введите текст..."
          value={text}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
        />
      </div>
      {validationError && <p className="error_message">{validationError}</p>}
    </div>
  );
}

export default ChipsInput;
