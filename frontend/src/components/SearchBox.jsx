import React from 'react';
import { Form } from 'react-bootstrap';
const SearchBox = props => {
   return (
        <Form.Control
        className='form-control'
        type='text'
        placeholder='Search...'
        value={props.value}
        onChange={(event) => props.setSearchValue(event.target.value)}
        onKeyDown={(event) => event.key === 'Enter' ? props.enterPress() : null}
        />
   );
};
export default SearchBox;