import { useEffect, useRef, useState } from "react";

export default function KakaoAutoMap() {
    const mapRef = useRef(null);
    useEffect(() => {
        
        const script = document.createElement("script");
        script.src = "https://dapi.kakao.com/v2/maps/sdk.js?appkey=b45e17b7b219bd89b4d738b6c5a76631&autoload=false&libraries=services";
        script.async = true;

        script.onload = () => {
            const kakao = window.kakao;

            setTimeout(() => {
                
                // 지도 생성
                const mapContainer = mapRef.current;

                // services 객체 및 Places 클래스 유효성 최종 검사
                if (!kakao.maps || !kakao.maps.services || !kakao.maps.services.Places) {
                    console.error("Critical: Kakao Maps services or Places still not available.");
                    return;
                }

                // 기본 지도 위치
                const mapOption = {
                    center: new kakao.maps.LatLng(37.566826, 126.9786567),
                    level: 3,
                };

                const map = new kakao.maps.Map(mapContainer, mapOption);

                const infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

                                
                if (navigator.geolocation) {
                    
                    //사용자 위치 정보 제공 동의
                    navigator.geolocation.getCurrentPosition(function (position) {
                        const lat = position.coords.latitude;   //사용자 위도
                        const lon = position.coords.longitude;  //사용자 경도
                        const locPosition = new kakao.maps.LatLng(lat, lon);
                                                
                        // 장소 검색 객체 생성
                        const ps = new kakao.maps.services.Places();
                        
                        // 키워드 검색
                        map.setLevel(5);
                        map.setCenter(locPosition);
                        ps.keywordSearch("자동차정비", placesSearchCB, {location : locPosition, radius : 7000});
                        
                        // 검색 완료 콜백 (기존 함수 그대로 유지)
                        function placesSearchCB(data, status) {
                            if (status === kakao.maps.services.Status.OK) {

                                // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
                                // LatLngBounds 객체에 좌표를 추가합니다
                                var bounds = new kakao.maps.LatLngBounds();

                                for (var i=0; i<data.length; i++) {
                                    displayMarker(data[i]);    
                                    bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
                                }       

                                // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
                                map.setBounds(bounds);
                            } 
                        }

                        // 지도에 마커 표시 (기존 함수 그대로 유지)
                        function displayMarker(place) {
                            console.log(place);
                            const marker = new kakao.maps.Marker({
                                map,
                                position: new kakao.maps.LatLng(place.y, place.x),
                            });
                            window.closeInfoWindow = function() {
                                infowindow.close();
                            };
                            kakao.maps.event.addListener(marker, "click", function () {
                                // 카테고리에서 마지막 부분만 추출
                                const category = place.category_name.split(' > ').pop();
                                
                                // 스타일링된 InfoWindow 내용
                                const content = `
                                    <div style="
                                        padding: 16px;
                                        min-width: 280px;
                                        max-width: 320px;
                                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                                        background: white;
                                        border-radius: 12px;
                                        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                                    ">  
                                        <button onclick="closeInfoWindow()" style="
                                            position: absolute;
                                            top: 12px;
                                            right: 12px;
                                            width: 24px;
                                            height: 24px;
                                            border: none;
                                            background: #f0f0f0;
                                            border-radius: 50%;
                                            cursor: pointer;
                                            font-size: 14px;
                                            color: #666;
                                            display: flex;
                                            align-items: center;
                                            justify-content: center;
                                            padding: 0;
                                            transition: all 0.2s;
                                        " onmouseover="this.style.background='#e0e0e0'" onmouseout="this.style.background='#f0f0f0'">
                                            ✕
                                        </button>
                                        <div style="
                                            font-size: 16px;
                                            font-weight: 700;
                                            color: #1a1a1a;
                                            margin-bottom: 12px;
                                            line-height: 1.4;
                                        ">
                                            ${place.place_name}
                                        </div>
                                        
                                        ${category ? `
                                        <div style="
                                            display: inline-block;
                                            padding: 4px 10px;
                                            background: #e8f5ff;
                                            color: #0066cc;
                                            border-radius: 12px;
                                            font-size: 11px;
                                            font-weight: 600;
                                            margin-bottom: 12px;
                                        ">
                                            ${category}
                                        </div>
                                        ` : ''}
                                        
                                        <div style="
                                            padding: 10px 0;
                                            border-top: 1px solid #f0f0f0;
                                        ">
                                            ${place.phone ? `
                                            <div style="
                                                display: flex;
                                                align-items: center;
                                                margin-bottom: 8px;
                                                font-size: 13px;
                                                color: #333;
                                            ">
                                                <span style="margin-right: 8px;">📞</span>
                                                <a href="tel:${place.phone}" style="
                                                    color: #0066cc;
                                                    text-decoration: none;
                                                    font-weight: 500;
                                                ">
                                                    ${place.phone}
                                                </a>
                                            </div>
                                            ` : ''}
                                            
                                            ${place.road_address_name ? `
                                            <div style="
                                                display: flex;
                                                align-items: flex-start;
                                                margin-bottom: 8px;
                                                font-size: 13px;
                                                color: #666;
                                                line-height: 1.5;
                                            ">
                                                <span style="margin-right: 8px; margin-top: 1px;">📍</span>
                                                <span>${place.road_address_name}</span>
                                            </div>
                                            ` : ''}
                                            
                                            ${place.place_url ? `
                                            <div style="margin-top: 12px;">
                                                <a href="${place.place_url}" 
                                                   target="_blank" 
                                                   rel="noopener noreferrer"
                                                   style="
                                                    display: inline-block;
                                                    padding: 8px 16px;
                                                    background: #fee500;
                                                    color: #3c1e1e;
                                                    text-decoration: none;
                                                    border-radius: 6px;
                                                    font-size: 13px;
                                                    font-weight: 600;
                                                    transition: all 0.2s;
                                                ">
                                                    카카오맵에서 보기
                                                </a>
                                            </div>
                                            ` : ''}
                                        </div>
                                    </div>
                                `;
                                
                                infowindow.setContent(content);
                                infowindow.open(map, marker);
                            });
                        }
                    });
                }
                


            }, 100); //100ms 지연 (services 라이브러리가 로드될 시간을 부여)
        };

        document.head.appendChild(script);

        // cleanup
        return () => {
            const existingScript = document.querySelector(`script[src*="kakao.com/v2/maps/sdk.js"]`);
            if (existingScript) {
                document.head.removeChild(existingScript);
            }
        };
    }, []);

    return (
        <div
            ref={mapRef}
            style={{ width: "100%", height: "400px", background: "#eee" }}
        ></div>
    );
}
