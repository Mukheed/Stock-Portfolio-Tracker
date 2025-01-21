 const stocks = [];
        let editingStock = null;

        const addStockButton = document.getElementById('addStockButton');
        const addStockForm = document.getElementById('addStockForm');
        const closeFormButton = document.getElementById('closeFormButton');
        const saveStockButton = document.getElementById('saveStockButton');
        const stocksTableBody = document.getElementById('stocksTableBody');
        const totalValueElement = document.getElementById('totalValue');
        const totalGainLossElement = document.getElementById('totalGainLoss');
        const topPerformerElement = document.getElementById('topPerformer');
        const portfolioSizeElement = document.getElementById('portfolioSize');

        addStockButton.addEventListener('click', () => {
            addStockForm.style.display = 'block';
        });

        closeFormButton.addEventListener('click', () => {
            addStockForm.style.display = 'none';
        });

        saveStockButton.addEventListener('click', () => {
            const symbol = document.getElementById('symbolInput').value.toUpperCase();
            const name = document.getElementById('nameInput').value;
            const quantity = Number(document.getElementById('quantityInput').value);
            const purchasePrice = Number(document.getElementById('purchasePriceInput').value);
            const currentPrice = Number(document.getElementById('currentPriceInput').value);

            if (!symbol || !name || !quantity || !purchasePrice || !currentPrice) {
                alert('Please fill in all fields');
                return;
            }

            const stock = {
                id: Math.random().toString(36).substr(2, 9),
                symbol,
                name,
                quantity,
                purchasePrice,
                currentPrice,
                createdAt: new Date().toISOString(),
            };

            stocks.push(stock);
            addStockForm.style.display = 'none';
            renderStocks();
            calculateMetrics();
        });

        function renderStocks() {
            stocksTableBody.innerHTML = '';
            stocks.forEach(stock => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${stock.symbol}</td>
                    <td>${stock.name}</td>
                    <td>${stock.quantity}</td>
                    <td>$${stock.purchasePrice.toFixed(2)}</td>
                    <td>$${stock.currentPrice.toFixed(2)}</td>
                    <td>${((stock.currentPrice - stock.purchasePrice) * stock.quantity).toFixed(2)}</td>
                    <td class="actions">
                        <button class="edit" onclick="editStock('${stock.id}')"><i class="fas fa-edit"></i></button>
                        <button class="delete" onclick="deleteStock('${stock.id}')"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                stocksTableBody.appendChild(row);
            });
        }

        function editStock(id) {
            const stock = stocks.find(s => s.id === id);
            if (!stock) return;

            editingStock = stock;
            document.getElementById('symbolInput').value = stock.symbol;
            document.getElementById('nameInput').value = stock.name;
            document.getElementById('quantityInput').value = stock.quantity;
            document.getElementById('purchasePriceInput').value = stock.purchasePrice;
            document.getElementById('currentPriceInput').value = stock.currentPrice;

            addStockForm.style.display = 'block';
            saveStockButton.textContent = 'Update Stock';
            saveStockButton.removeEventListener('click', addStock);
            saveStockButton.addEventListener('click', updateStock);
        }

        function updateStock() {
            if (!editingStock) return;

            editingStock.symbol = document.getElementById('symbolInput').value.toUpperCase();
            editingStock.name = document.getElementById('nameInput').value;
            editingStock.quantity = Number(document.getElementById('quantityInput').value);
            editingStock.purchasePrice = Number(document.getElementById('purchasePriceInput').value);
            editingStock.currentPrice = Number(document.getElementById('currentPriceInput').value);

            addStockForm.style.display = 'none';
            saveStockButton.textContent = 'Add Stock';
            saveStockButton.removeEventListener('click', updateStock);
            saveStockButton.addEventListener('click', addStock);

            renderStocks();
            calculateMetrics();
        }

        function deleteStock(id) {
            const index = stocks.findIndex(s => s.id === id);
            if (index === -1) return;

            stocks.splice(index, 1);
            renderStocks();
            calculateMetrics();
        }

        function calculateMetrics() {
            const totalValue = stocks.reduce((sum, stock) => sum + (stock.currentPrice * stock.quantity), 0);
            const totalCost = stocks.reduce((sum, stock) => sum + (stock.purchasePrice * stock.quantity), 0);
            const totalGainLoss = totalValue - totalCost;

            const sortedByPerformance = [...stocks].sort((a, b) => {
                const aPerformance = (a.currentPrice - a.purchasePrice) / a.purchasePrice;
                const bPerformance = (b.currentPrice - b.purchasePrice) / b.purchasePrice;
                return bPerformance - aPerformance;
            });

            totalValueElement.textContent = `$${totalValue.toFixed(2)}`;
            totalGainLossElement.textContent = `$${totalGainLoss.toFixed(2)}`;
            topPerformerElement.textContent = sortedByPerformance[0]?.symbol || '-';
            portfolioSizeElement.textContent = `${stocks.length} stocks`;
        }