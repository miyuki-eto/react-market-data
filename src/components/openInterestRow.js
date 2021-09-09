import React, {useState, useRef} from 'react';

export default function OpenInterestRow({token, exchangeData}) {
    const [isOpenTable, setIsOpenTable] = useState(false);

    function formatMoney(number) {
        return number.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
    }

    const toggleTable = () => {
        setIsOpenTable(!isOpenTable);
    };

    const Collapse = ({isOpen, children}) => {
        const ref = useRef(null);
        const inlineStyle = isOpen ? {height: ref.current?.scrollHeight} : {height: 0};
        return (
            <div
                className="mt-0 overflow-hidden text-gray-600 transition-height ease duration-1000"
                ref={ref}
                style={inlineStyle}
            >
                {children}
            </div>
        );
    };

    return (
            <tr className="">
                <td className="px-4">{token.symbol}</td>
                <td className="px-4">{formatMoney(token.openInterest)}</td>
                <td className="px-4">{token.openInterestAmount.toFixed(2)}</td>
                <td className={`${token.h1OIChangePercent > 0 ? 'text-green-300' : 'text-red-300'}` + " px-4"}>{token.h1OIChangePercent.toFixed(2) + "%"}</td>
                <td className={`${token.h4OIChangePercent > 0 ? 'text-green-300' : 'text-red-300'}` + " px-4"}>{token.h4OIChangePercent.toFixed(2) + "%"}</td>
                <td className={`${token.h24Change > 0 ? 'text-green-300' : 'text-red-300'}` + " px-4"}>{token.h24Change.toFixed(2) + "%"}</td>

            </tr>
    );
}
