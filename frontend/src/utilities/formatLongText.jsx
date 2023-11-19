const formatLongText = (text, limitLenght, handleClick) => {
    return (text.length < limitLenght) ? text : 
    <>
        {text.substring(0, limitLenght)}<br/>
        <a className="sv-a" onClick={handleClick}>Expand To Read More <i className="fa-solid fa-chevron-down"></i></a>
    </>
}
export default formatLongText;