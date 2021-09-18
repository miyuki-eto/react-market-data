import React from 'react'

export default function KlineLayout ({ title, children }) {
    return (
        <div
            className="k-line-chart-container">
            <h3
                className="k-line-chart-title">{title}</h3>
            {children}
        </div>
    )
}