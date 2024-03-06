import { Alert, ScrollView, Text, View } from "react-native";
import Ingredient from "@/components/Ingredient";
import Selected from "@/components/Selected";
import { useState, useEffect } from "react";
import { services } from "@/services";
import { router } from "expo-router";
import { styles } from "./styles";

export default function Index() {
  const [selected, setSelected] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<IngredientResponse[]>([]);

  function handleToggleSelected(value: string) {
    if (selected.includes(value)) {
      return setSelected((state) => state.filter((item) => item !== value));
    }

    setSelected((state) => [...state, value]);
  }

  function handleClearSelected() {
    Alert.alert("Clear", "Clear all selected ingredients?", [
      { text: "No", style: "cancel" },
      { text: "Yes", onPress: () => setSelected([]) },
    ]);
  }

  function handleSearch() {
    router.navigate("/recipes/" + selected);
  }

  useEffect(() => {
    services.ingredients.findAll().then(setIngredients);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Pick{"\n"}
        <Text style={styles.subtitle}>your ingredients</Text>
      </Text>
      <Text style={styles.intro}>
        Discover new recipes based on your chosen ingredients!
      </Text>

      <ScrollView
        contentContainerStyle={styles.ingredientsContainer}
        showsVerticalScrollIndicator={false}
      >
        {ingredients.map((item) => (
          <Ingredient
            key={item.id}
            name={item.name}
            image={`${services.storage.imagePath}/${item.image}`}
            selected={selected.includes(item.id)}
            onPress={() => handleToggleSelected(item.id)}
          />
        ))}
      </ScrollView>

      {selected.length > 0 && (
        <Selected
          quantity={selected.length}
          onClear={handleClearSelected}
          onSearch={handleSearch}
        />
      )}
    </View>
  );
}
