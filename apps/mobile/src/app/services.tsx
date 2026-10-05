import React, { useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
} from "react-native"; 
import { Ionicons } from "@expo/vector-icons"; 
import { StatusBar } from "expo-status-bar"; 
import { router, useLocalSearchParams } from "expo-router"; 
 
const serviceCategories = [ 
  { 
    title: "Home Repair", 
    subtitle: "Fix problems around your home", 
    services: [ 
      { 
        name: "Plumber", 
        description: "Leaks, taps, pipes & plumbing", 
        icon: "water-outline" as const, 
      }, 
      { 
        name: "Electrician", 
        description: "Wiring, switches & electrical work", 
        icon: "flash-outline" as const, 
      }, 
      { 
        name: "AC Service", 
        description: "Repair, service & installation", 
        icon: "snow-outline" as const, 
      }, 
      { 
        name: "Appliance Repair", 
        description: "Repair your home appliances", 
        icon: "construct-outline" as const, 
      }, 
    ], 
  }, 
  { 
    title: "Home Care", 
    subtitle: "Keep your home clean & healthy", 
    services: [ 
      { 
        name: "Home Cleaning", 
        description: "Regular & professional cleaning", 
        icon: "sparkles-outline" as const, 
      }, 
      { 
        name: "Deep Cleaning", 
        description: "Complete home deep cleaning", 
        icon: "star-outline" as const, 
      }, 
      { 
        name: "Pest Control", 
        description: "Protect your home from pests", 
        icon: "bug-outline" as const, 
      }, 
      { 
        name: "Painting", 
        description: "Interior & exterior painting", 
        icon: "color-palette-outline" as const, 
      }, 
    ], 
  }, 
  { 
    title: "Home Improvement", 
    subtitle: "Upgrade and improve your home", 
    services: [ 
      { 
        name: "Carpenter", 
        description: "Furniture, doors & woodwork", 
        icon: "hammer-outline" as const, 
      }, 
      { 
        name: "Interior Work", 
        description: "Design & home improvement", 
        icon: "home-outline" as const, 
      }, 
      { 
        name: "Installation", 
        description: "Professional product installation", 
        icon: "build-outline" as const, 
      }, 
      { 
        name: "Moving", 
        description: "Safe home shifting services", 
        icon: "cube-outline" as const, 
      }, 
    ], 
  }, 
]; 
 
export default function ServicesScreen() { 
  const params = useLocalSearchParams();

  const openService = (serviceName: string) => { 
    router.push({ 
      pathname: "/service", 
      params: { 
        name: serviceName, 
      }, 
    }); 
  }; 

  useEffect(() => {
    const recommendedService = String(
      params.recommendedService || ""
    );

    if (!recommendedService) {
      return;
    }

    const serviceMap: Record<string, string> = {
      "AC Repair & Service": "AC Service",
      "Plumbing Service": "Plumber",
      "Electrician Service": "Electrician",
      "Home Cleaning": "Home Cleaning",
      "Refrigerator Repair": "Appliance Repair",
      "Washing Machine Repair": "Appliance Repair",
      "TV Repair Service": "Appliance Repair",
      "Home Service Professional": "Appliance Repair",
    };

    const matchingService =
      serviceMap[recommendedService];

    if (matchingService) {
      openService(matchingService);
    }
  }, [params.recommendedService]);
 
  return ( 
    <View style={styles.container}> 
      <StatusBar style="light" /> 
 
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.content} 
      > 
        {/* Header */} 
        <View style={styles.header}> 
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()} 
          > 
            <Ionicons 
              name="arrow-back" 
              size={22} 
              color="#F7F1E3" 
            /> 
          </TouchableOpacity> 
 
          <View style={styles.headerText}> 
            <Text style={styles.brand}>HOMEAI</Text> 
            <Text style={styles.title}>Services</Text> 
          </View> 
        </View> 
 
        <Text style={styles.subtitle}> 
          Professional help for everything at home. 
        </Text> 
 
        {/* Search */} 
        <TouchableOpacity 
          style={styles.searchBox} 
          onPress={() => {}} 
          activeOpacity={0.8} 
        > 
          <Ionicons 
            name="search-outline" 
            size={20} 
            color="#777" 
          /> 
 
          <Text style={styles.searchText}> 
            What do you need help with? 
          </Text> 
        </TouchableOpacity> 
 
        {/* Categories */} 
        {serviceCategories.map((category) => ( 
          <View key={category.title} style={styles.categorySection}> 
            <Text style={styles.categoryTitle}> 
              {category.title} 
            </Text> 
 
            <Text style={styles.categorySubtitle}> 
              {category.subtitle} 
            </Text> 
 
            <View style={styles.grid}> 
              {category.services.map((service) => ( 
                <TouchableOpacity 
                  key={service.name} 
                  style={styles.serviceCard} 
                  activeOpacity={0.75} 
                  onPress={() => openService(service.name)} 
                > 
                  <View style={styles.iconContainer}> 
                    <Ionicons 
                      name={service.icon} 
                      size={25} 
                      color="#D8B56A" 
                    /> 
                  </View> 
 
                  <Text style={styles.serviceName}> 
                    {service.name} 
                  </Text> 
 
                  <Text style={styles.serviceDescription}> 
                    {service.description} 
                  </Text> 
 
                  <View style={styles.cardBottom}> 
                    <Text style={styles.bookText}> 
                      View service 
                    </Text> 
 
                    <Ionicons 
                      name="chevron-forward" 
                      size={16} 
                      color="#D8B56A" 
                    /> 
                  </View> 
                </TouchableOpacity> 
              ))} 
            </View> 
          </View> 
        ))} 
 
        {/* AI Recommendation */} 
        <TouchableOpacity 
          style={styles.aiCard} 
          activeOpacity={0.8} 
          onPress={() => router.push("/ai")} 
        > 
          <View style={styles.aiIcon}> 
            <Ionicons 
              name="sparkles" 
              size={25} 
              color="#D8B56A" 
            /> 
          </View> 
 
          <View style={styles.aiContent}> 
            <Text style={styles.aiTitle}> 
              Not sure what you need? 
            </Text> 
 
            <Text style={styles.aiText}> 
              Ask HomeAI and we'll help you find the right service. 
            </Text> 
          </View> 
 
          <Ionicons 
            name="chevron-forward" 
            size={22} 
            color="#D8B56A" 
          /> 
        </TouchableOpacity> 
 
        <View style={styles.bottomSpace} /> 
      </ScrollView> 
    </View> 
  ); 
} 
 
const styles = StyleSheet.create({ 
  container: { 
    flex: 1, 
    backgroundColor: "#101010", 
  }, 
 
  content: { 
    paddingHorizontal: 20, 
    paddingTop: 58, 
    paddingBottom: 40, 
  }, 
 
  header: { 
    flexDirection: "row", 
    alignItems: "center", 
  }, 
 
  backButton: { 
    width: 44, 
    height: 44, 
    borderRadius: 15, 
    backgroundColor: "#181818", 
    borderWidth: 1, 
    borderColor: "#292929", 
    alignItems: "center", 
    justifyContent: "center", 
    marginRight: 14, 
  }, 
 
  headerText: { 
    flex: 1, 
  }, 
 
  brand: { 
    color: "#D8B56A", 
    fontSize: 11, 
    fontWeight: "700", 
    letterSpacing: 3, 
  }, 
 
  title: { 
    color: "#F7F1E3", 
    fontSize: 30, 
    fontWeight: "800", 
    marginTop: 3, 
  }, 
 
  subtitle: { 
    color: "#858585", 
    fontSize: 14, 
    lineHeight: 21, 
    marginTop: 12, 
    marginBottom: 20, 
  }, 
 
  searchBox: { 
    height: 54, 
    borderRadius: 17, 
    backgroundColor: "#181818", 
    borderWidth: 1, 
    borderColor: "#292929", 
    flexDirection: "row", 
    alignItems: "center", 
    paddingHorizontal: 16, 
    marginBottom: 30, 
  }, 
 
  searchText: { 
    color: "#686868", 
    fontSize: 14, 
    marginLeft: 12, 
  }, 
 
  categorySection: { 
    marginBottom: 30, 
  }, 
 
  categoryTitle: { 
    color: "#F7F1E3", 
    fontSize: 21, 
    fontWeight: "800", 
  }, 
 
  categorySubtitle: { 
    color: "#707070", 
    fontSize: 12, 
    marginTop: 5, 
    marginBottom: 14, 
  }, 
 
  grid: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    justifyContent: "space-between", 
  }, 
 
  serviceCard: { 
    width: "48.2%", 
    minHeight: 175, 
    backgroundColor: "#191919", 
    borderRadius: 21, 
    borderWidth: 1, 
    borderColor: "#2C2C2C", 
    padding: 15, 
    marginBottom: 12, 
  }, 
 
  iconContainer: { 
    width: 48, 
    height: 48, 
    borderRadius: 15, 
    backgroundColor: "#292214", 
    borderWidth: 1, 
    borderColor: "#40351F", 
    alignItems: "center", 
    justifyContent: "center", 
    marginBottom: 14, 
  }, 
 
  serviceName: { 
    color: "#F7F1E3", 
    fontSize: 15, 
    fontWeight: "700", 
  }, 
 
  serviceDescription: { 
    color: "#777", 
    fontSize: 11, 
    lineHeight: 16, 
    marginTop: 5, 
  }, 
 
  cardBottom: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    marginTop: "auto", 
    paddingTop: 12, 
  }, 
 
  bookText: { 
    color: "#D8B56A", 
    fontSize: 11, 
    fontWeight: "600", 
  }, 
 
  aiCard: { 
    backgroundColor: "#191919", 
    borderRadius: 22, 
    borderWidth: 1, 
    borderColor: "#4A3B20", 
    padding: 18, 
    flexDirection: "row", 
    alignItems: "center", 
    marginTop: 5, 
  }, 
 
  aiIcon: { 
    width: 50, 
    height: 50, 
    borderRadius: 16, 
    backgroundColor: "#292214", 
    alignItems: "center", 
    justifyContent: "center", 
  }, 
 
  aiContent: { 
    flex: 1, 
    marginLeft: 14, 
    marginRight: 10, 
  }, 
 
  aiTitle: { 
    color: "#F7F1E3", 
    fontSize: 15, 
    fontWeight: "700", 
  }, 
 
  aiText: { 
    color: "#777", 
    fontSize: 11, 
    lineHeight: 16, 
    marginTop: 4, 
  }, 
 
  bottomSpace: { 
    height: 20, 
  }, 
});