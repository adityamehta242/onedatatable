import { css } from 'lit';

export const myStyle = css`
    :host {
            display: block;
            font-family: Arial, sans-serif;
            --table-border-color: #ddd;
            --header-bg-color: #f2f2f2;
            --row-hover-color: #f8f8f8;
            --subtable-level-1-bg: #f9f9f9;
            --subtable-level-2-bg: #f3f3f3;
            --text-color: #000;
            --background-color: #fff;
            --button-bg: #f2f2f2;
            --button-hover-bg: #e0e0e0;
            color: var(--text-color);
            background-color: var(--background-color);
        }
        :host([theme="dark"]) {
            --table-border-color: #555;
            --header-bg-color: #333;
            --row-hover-color: #444;
            --subtable-level-1-bg: #222;
            --subtable-level-2-bg: #111;
            --text-color: #fff;
            --background-color: #000;
            --button-bg: #444;
            --button-hover-bg: #555;
        }
        .container {
            margin: 1rem 0;
        }
        .search-container {
            margin-bottom: 1rem;
        }
        input[type="text"] {
            padding: 8px;
            width: 100%;
            box-sizing: border-box;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            --table-border-color: #ddd;
            --header-bg-color: #f2f2f2;
            --row-hover-color: #f8f8f8;
            --subtable-level-1-bg: #f9f9f9;
            --subtable-level-2-bg: #f3f3f3;
            --subtable-border: 1px solid #e0e0e0;
        }
        th, td {
            border: 1px solid var(--table-border-color);
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: var(--header-bg-color);
            cursor: pointer;
            position: relative;
        }
        th:hover {
            background-color: #e8e8e8;
        }
        tr:hover {
            background-color: var(--row-hover-color);
        }
        .info {
            margin: 10px 0;
            font-size: 0.9rem;
            color: #666;
        }
        .pagination {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 1rem;
        }
        button {
            padding: 6px 12px;
            background: var(--button-bg);
            border: 1px solid var(--table-border-color);
            cursor: pointer;
        }
        button:hover {
            background: var(--button-hover-bg);
        }
        button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        button:not(:disabled):hover {
            background: #e0e0e0;
        }
        .expand-button {
            cursor: pointer;
            border: none;
            padding: 4px;
            margin-right: 8px;
            width: 24px;
            height: 24px;
            text-align: center;
            line-height: 1;
        }
        .subtable-container {
            padding-left: 20px;
        }
        .subtable {
            width: 100%;
            margin: 8px 0;
            border: var(--subtable-border);
        }
        .subtable-level-1 {
            background-color: var(--subtable-level-1-bg);
        }
        .subtable-level-2 {
            background-color: var(--subtable-level-2-bg);
        }
        .subtable-header {
            font-weight: bold;
            margin: 8px 0;
            text-transform: capitalize;
        }
        .sort-icon {
            display: inline-block;
            margin-left: 5px;
        }
    `;