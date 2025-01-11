# 清理 yarn 缓存
echo "Clearing yarn cache..."
yarn cache clean

# 删除 iOS 构建缓存
echo "Cleaning iOS build folder..."
rm -rf ios/build

# 删除 Xcode 构建缓存 (DerivedData)
echo "Cleaning Xcode DerivedData..."
rm -rf ~/Library/Developer/Xcode/DerivedData/*

# 重新安装 CocoaPods 依赖
echo "Installing CocoaPods dependencies..."
cd ios && pod install --repo-update

# 清理完毕
echo "Clean and reinstall complete!"
					       
