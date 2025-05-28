
import streamlit as st
import pandas as pd
import io

# Цены по умолчанию (можно позже загрузить из Excel)
PRICES = {
    "Встреча в аэропорту": 5000,
    "Трансфер Tundra (день)": 12000,
    "Баня на колёсах (сеанс)": 15000,
    "Дополнительное шале (ночь)": 18000,
    "Обед в шатре (на человека)": 2500,
    "Нацпарк (въезд на человека)": 1000
}

st.title("Калькулятор сметы Yaskin Group")

st.header("Основные параметры тура")
num_days = st.number_input("Количество дней", min_value=1, value=3)
num_people = st.number_input("Количество человек", min_value=1, value=2)

st.header("Выберите опции")

meet_airport = st.checkbox("Встреча в аэропорту")
tundra_days = st.number_input("Трансфер Tundra (кол-во дней)", min_value=0, value=3)
banya_count = st.number_input("Баня на колёсах (сеансов)", min_value=0, value=1)
shale_nights = st.number_input("Дополнительное шале (ночей)", min_value=0, value=1)
tent_lunches = st.number_input("Обедов в шатре", min_value=0, value=2)
national_park = st.checkbox("Посещение национального парка")

st.header("Расчёт сметы")

total = 0
details = []

if meet_airport:
    cost = PRICES["Встреча в аэропорту"]
    total += cost
    details.append(("Встреча в аэропорту", cost))

if tundra_days > 0:
    cost = PRICES["Трансфер Tundra (день)"] * tundra_days
    total += cost
    details.append((f"Tundra, {tundra_days} дн.", cost))

if banya_count > 0:
    cost = PRICES["Баня на колёсах (сеанс)"] * banya_count
    total += cost
    details.append((f"Баня на колёсах × {banya_count}", cost))

if shale_nights > 0:
    cost = PRICES["Дополнительное шале (ночь)"] * shale_nights
    total += cost
    details.append((f"Доп. шале × {shale_nights}", cost))

if tent_lunches > 0:
    cost = PRICES["Обед в шатре (на человека)"] * tent_lunches * num_people
    total += cost
    details.append((f"Обед в шатре × {tent_lunches} × {num_people}", cost))

if national_park:
    cost = PRICES["Нацпарк (въезд на человека)"] * num_people
    total += cost
    details.append((f"Нацпарк × {num_people}", cost))

st.subheader("Итоговая смета:")
for name, price in details:
    st.text(f"{name}: {price:,} ₽")
st.markdown(f"### **Итого: {total:,} ₽**")

# Экспорт в Excel
if st.button("Скачать смету в Excel"):
    df = pd.DataFrame(details, columns=["Опция", "Стоимость (₽)"])
    df.loc[len(df.index)] = ["ИТОГО", total]
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine="xlsxwriter") as writer:
        df.to_excel(writer, index=False, sheet_name="Смета")
    st.download_button(
        label="📥 Скачать Excel",
        data=output.getvalue(),
        file_name="smeta.xlsx",
        mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
