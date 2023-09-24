import * as tf from '@tensorflow/tfjs'
import '@tensorflow/tfjs-node'
import Products from '../models/product.js';
import Order from '../models/order.js';
import KhachHang from '../models/khachhang.js';
export const recommendProducts = async (req, res) => {
  const makh=req.query.makh || "KH14"
  const soluong=req.query.soluong || 10
  try {
    //Dữ liệu sản phẩm
    const listproducts = await Products.find({});
    let products = [];
    listproducts.map((value, index) => {
      const product = {
        id: value._id.toString(),
        tensanpham: value.tensanpham,
        loaisanpham: value.loaisanpham,
        gia: value.gia,
        hinh: value.hinh
      }
      products.push(product)
    })
    console.log(products)
    //Dữ liệu lịch sử mua hàng của người dùng
    let purchaseHistory = [];

    const handeDataPurchase = async () => {
      const listUser = await KhachHang.find({});

      for (const valueUser of listUser) {
        const listPurchase = await Order.find({ makh: valueUser.makh });

        for (const valuePurchase of listPurchase) {
          for (const value of valuePurchase.products) {
            const addPurchase = { userId: valueUser.makh, productId: value.productId };
            purchaseHistory.push(addPurchase);
          }
        }
      }
    };

    const p = new Promise((resolve, reject) => {
      handeDataPurchase()
        .then(() => resolve(purchaseHistory))
        .catch((error) => reject(error));
    });

    p.then(function (data) {
      // Step 1: Load the purchase history data into a JavaScript array
      const purchaseHistory = data;
    
      // Step 2: Count the number of purchases for each user and product combination
      function countPurchases(purchaseHistory) {
        const userProductCounts = new Map();
    
        for (let i = 0; i < purchaseHistory.length; i++) {
          const { userId, productId } = purchaseHistory[i];
          const key = `${userId}-${productId}`;
    
          if (userProductCounts.has(key)) {
            userProductCounts.set(key, userProductCounts.get(key) + 1);
          } else {
            userProductCounts.set(key, 1);
          }
        }
    
        // Convert counts to a sparse matrix
        const sparseMatrix = [];
    
        userProductCounts.forEach((count, key) => {
          const [userId, productId] = key.split('-');
          sparseMatrix.push({ userId, productId, count });
        });
    
        return sparseMatrix;
      }
    
      const sparseMatrix = countPurchases(purchaseHistory);
    
      // Step 3: Compute the cosine similarity matrix
      function computeCosineSimilarityMatrix(sparseMatrix) {
        const productPurchaseHistory = new Map();
    
        for (let i = 0; i < sparseMatrix.length; i++) {
          const { userId, productId } = sparseMatrix[i];
          if (productPurchaseHistory.has(productId)) {
            productPurchaseHistory.get(productId).push(userId);
          } else {
            productPurchaseHistory.set(productId, [userId]);
          }
        }
    
        const cosineSimilarityMatrix = {};
    
        for (let [productA, usersA] of productPurchaseHistory.entries()) {
          cosineSimilarityMatrix[productA] = {};
    
          for (let [productB, usersB] of productPurchaseHistory.entries()) {
            const commonUsers = new Set([...usersA, ...usersB]);
            const dotProduct = usersA.reduce((sum, user) => {
              if (usersB.includes(user)) {
                return sum + 1;
              }
              return sum;
            }, 0);
    
            const magnitudeA = Math.sqrt(usersA.length);
            const magnitudeB = Math.sqrt(usersB.length);
    
            const cosineSimilarity = dotProduct / (magnitudeA * magnitudeB);
    
            cosineSimilarityMatrix[productA][productB] = cosineSimilarity;
          }
        }
    
        return cosineSimilarityMatrix;
      }
    
      const cosineSimilarityMatrix = computeCosineSimilarityMatrix(sparseMatrix);
    
      // Step 4: Define a function to recommend items for a user
      function recommendItems(userId, n) {
        // Compute the user's purchase history
        const userPurchaseHistory = purchaseHistory.filter(
          (purchase) => purchase.userId === userId
        );
    
        // Compute the average cosine similarity between the user's purchased items and all other items
        const purchasedProducts = userPurchaseHistory.map(
          (purchase) => purchase.productId
        );
    
        const similarityScores = {};
    
        for (let product in cosineSimilarityMatrix) {
          let sum = 0;
          let count = 0;
    
          for (let purchasedProduct of purchasedProducts) {
            if (cosineSimilarityMatrix[product].hasOwnProperty(purchasedProduct)) {
              sum += cosineSimilarityMatrix[product][purchasedProduct];
              count++;
            }
          }
    
          similarityScores[product] = count > 0 ? sum / count : 0;
        }
    
        // Get the indices of the user's purchased items and set their similarity scores to 0
        const purchasedIndices = userPurchaseHistory.map(
          (purchase) => purchase.productId
        );
    
        for (let purchasedIndex of purchasedIndices) {
          similarityScores[purchasedIndex] = 0;
        }
    
        // Sort the items by similarity score and return the top n items
        const recommendedItems = Object.keys(similarityScores).sort(
          (a, b) => similarityScores[b] - similarityScores[a]
        );
    
        // Remove the items that the user has already purchased from the recommended list
        const filteredRecommendations = recommendedItems.filter(
          (item) => !purchasedIndices.includes(item)
        );
    
        return filteredRecommendations.slice(0, n);
      }
    
    
      // Triển khai các bước trên
      (async () => {
        // Example usage:
        const recommendedItemsForUser = recommendItems(makh, 5);
        console.log("Recommended products for user", makh);
        res.send(products.filter(obj => recommendedItemsForUser.includes(obj.id)))
      })();
    })
  } catch (e) {
    res.status(500).send(e)
  }
}