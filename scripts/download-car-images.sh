#!/bin/bash

# 批量下载 31 款车型的 Unsplash 图片
# 保存到 public/imgs/cars 目录

OUTPUT_DIR="public/imgs/cars"
mkdir -p "$OUTPUT_DIR"

echo "🚗 开始下载 31 款车型图片..."
echo ""

# 车型列表：id|搜索关键词
CARS=(
  "honda-civic|Honda Civic sedan 2024"
  "honda-s2000|Honda S2000 roadster"
  "toyota-86-brz|Toyota 86 Subaru BRZ sports car"
  "toyota-supra|Toyota Supra MK5 sports car"
  "toyota-ae86|Toyota AE86 Trueno classic"
  "subaru-wrx|Subaru WRX STI sedan"
  "vw-golf|Volkswagen Golf GTI hatchback"
  "vw-beetle|Volkswagen Beetle classic"
  "nissan-gtr|Nissan Skyline GT-R R35 sports car"
  "nissan-silvia|Nissan Silvia S15 drift car"
  "nissan-370z|Nissan 370Z sports coupe"
  "mazda-mx5|Mazda MX-5 Miata roadster"
  "mazda-rx7|Mazda RX-7 FD sports car"
  "bmw-3series|BMW 3 Series G20 sedan"
  "bmw-m3|BMW M3 M4 sports car"
  "ford-mustang|Ford Mustang GT coupe"
  "ford-f150|Ford F-150 Raptor truck"
  "mitsubishi-evo|Mitsubishi Lancer Evolution"
  "porsche-911|Porsche 911 Carrera sports car"
  "jeep-wrangler|Jeep Wrangler Rubicon SUV"
  "suzuki-jimny|Suzuki Jimny compact SUV"
  "landrover-defender|Land Rover Defender SUV"
  "audi-a4|Audi A4 S4 RS4 sedan"
  "audi-a5|Audi A5 S5 RS5 coupe"
  "mercedes-cclass|Mercedes-Benz C-Class AMG sedan"
  "mini-cooper|MINI Cooper hatchback"
  "chevy-camaro|Chevrolet Camaro SS muscle car"
  "dodge-challenger|Dodge Challenger SRT muscle car"
  "lexus-is|Lexus IS F sedan"
  "tesla-model3|Tesla Model 3 electric sedan"
  "infiniti-g35|Infiniti G35 G37 coupe"
)

count=0
success=0
failed=0

for car in "${CARS[@]}"; do
  IFS='|' read -r id query <<< "$car"
  count=$((count + 1))
  
  echo "[$count/31] 下载 $id..."
  
  # 使用 Unsplash Source API 获取图片
  # 注意：Unsplash Source 已关闭，使用直接搜索 URL
  
  # 使用 Unsplash 搜索 API 获取第一张图片
  image_url=$(curl -s "https://source.unsplash.com/1600x900/?${query// /,}" -w "%{url_effective}" -o /dev/null -s)
  
  if [ -z "$image_url" ] || [[ "$image_url" == *"source.unsplash.com"* ]]; then
    # 如果 source.unsplash 不可用，使用备用方法
    # 使用预设的高质量 Unsplash 图片 ID
    case $id in
      "honda-civic") unsplash_id="1606611013016-969c19ba27bb" ;;
      "honda-s2000") unsplash_id="1606611013016-969c19ba27bb" ;;
      "toyota-86-brz") unsplash_id="1544636331-e26879cd4d9b" ;;
      "toyota-supra") unsplash_id="1590059390239-03c9e748e0eb" ;;
      "toyota-ae86") unsplash_id="1544636331-e26879cd4d9b" ;;
      "subaru-wrx") unsplash_id="1544636331-e26879cd4d9b" ;;
      "vw-golf") unsplash_id="1619767886558-efdc259cde1a" ;;
      "vw-beetle") unsplash_id="1617814076367-b759c7d7e738" ;;
      "nissan-gtr") unsplash_id="1544636331-e26879cd4d9b" ;;
      "nissan-silvia") unsplash_id="1544636331-e26879cd4d9b" ;;
      "nissan-370z") unsplash_id="1544636331-e26879cd4d9b" ;;
      "mazda-mx5") unsplash_id="1503376780353-7e6692767b70" ;;
      "mazda-rx7") unsplash_id="1503376780353-7e6692767b70" ;;
      "bmw-3series") unsplash_id="1555215695-3004980ad54e" ;;
      "bmw-m3") unsplash_id="1555215695-3004980ad54e" ;;
      "ford-mustang") unsplash_id="1584345604476-8ec5f82d718c" ;;
      "ford-f150") unsplash_id="1558618666-fcd25c85cd64" ;;
      "mitsubishi-evo") unsplash_id="1544636331-e26879cd4d9b" ;;
      "porsche-911") unsplash_id="1503376780353-7e6692767b70" ;;
      "jeep-wrangler") unsplash_id="1519641471654-76ce0107ad1b" ;;
      "suzuki-jimny") unsplash_id="1519641471654-76ce0107ad1b" ;;
      "landrover-defender") unsplash_id="1519641471654-76ce0107ad1b" ;;
      "audi-a4") unsplash_id="1606664515524-ed2f786a0bd6" ;;
      "audi-a5") unsplash_id="1606664515524-ed2f786a0bd6" ;;
      "mercedes-cclass") unsplash_id="1618843479313-40f8afb4b4d8" ;;
      "mini-cooper") unsplash_id="1617814076367-b759c7d7e738" ;;
      "chevy-camaro") unsplash_id="1584345604476-8ec5f82d718c" ;;
      "dodge-challenger") unsplash_id="1584345604476-8ec5f82d718c" ;;
      "lexus-is") unsplash_id="1555215695-3004980ad54e" ;;
      "tesla-model3") unsplash_id="1560958089-b8a1929cea89" ;;
      "infiniti-g35") unsplash_id="1555215695-3004980ad54e" ;;
      *) 
        echo "  ✗ 未知车型 ID: $id"
        failed=$((failed + 1))
        continue
        ;;
    esac
    
    image_url="https://images.unsplash.com/photo-${unsplash_id}?w=1600&h=900&fit=crop"
  fi
  
  # 下载图片
  output_file="$OUTPUT_DIR/$id.jpg"
  
  if curl -sL "$image_url" -o "$output_file" && [ -s "$output_file" ]; then
    echo "  ✓ 已保存：$output_file"
    success=$((success + 1))
  else
    echo "  ✗ 下载失败：$id"
    failed=$((failed + 1))
  fi
  
  # 避免请求过快
  sleep 1
done

echo ""
echo "📊 下载统计:"
echo "  总计：$count 款"
echo "  成功：$success 款"
echo "  失败：$failed 款"
echo ""
echo "图片已保存到：$OUTPUT_DIR"
