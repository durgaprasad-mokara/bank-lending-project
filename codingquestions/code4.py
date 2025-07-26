def minimize_loss(prices):
    min_loss = float('inf')
    buy, sell = -1, -1
    for i in range(len(prices)):
        for j in range(i+1, len(prices)):
            if prices[j] < prices[i] and prices[i] - prices[j] < min_loss:
                min_loss = prices[i] - prices[j]
                buy, sell = i+1, j+1
    return (buy, sell, min_loss)

prices = [20, 15, 7, 2, 13]
print(minimize_loss(prices))