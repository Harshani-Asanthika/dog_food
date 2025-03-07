import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';

const Education = () => {
  const [activeTab, setActiveTab] = useState('Nutrition');

  // Get screen width and height
  const screenWidth = Dimensions.get('window').width;

  return (
    <ScrollView style={styles.container}>
     

      {/* Tab Buttons */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Nutrition' && styles.activeTab]}
          onPress={() => setActiveTab('Nutrition')}
        >
          <Text style={styles.tabText}>Nutrition</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Breeds' && styles.activeTab]}
          onPress={() => setActiveTab('Breeds')}
        >
          <Text style={styles.tabText}>Breeds</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Health' && styles.activeTab]}
          onPress={() => setActiveTab('Health')}
        >
          <Text style={styles.tabText}>Health Tips</Text>
        </TouchableOpacity>
      </View>

      {/* Content based on active tab */}
      {activeTab === 'Nutrition' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🥗 Balanced Diet for Dogs</Text>
          <Image source={require('@/assets/images/dog-nutrition.png')} style={[styles.image, { width: screenWidth * 0.8 }]} />

          <Text style={styles.text}>
            A well-balanced diet includes proteins, fats, carbohydrates, vitamins, and minerals. Your dog's nutritional needs vary based on their age, breed, and health condition.
            <Text style={styles.boldText}> Puppies</Text> need higher amounts of protein and fat to support growth and development.
            <Text style={styles.boldText}> Adult dogs</Text> typically require a balanced mix of protein, fat, and carbohydrates for energy and muscle maintenance.
            <Text style={styles.boldText}> Senior dogs</Text> may need lower protein levels but higher fiber content to support digestion and joint health.
          </Text>

          <Text style={styles.sectionTitle}>🍖 Common Ingredients in Dog Food</Text>
          <Text style={styles.text}>
            Look for high-quality protein sources like chicken, beef, or lamb. Carbohydrates such as rice or sweet potatoes provide energy, while omega-3 fatty acids promote a shiny coat and healthy skin.
            Ensure that the food contains vitamins like A, D, and E, as well as minerals like calcium and phosphorus to support strong bones.
          </Text>
        </View>
      )}

      {activeTab === 'Breeds' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🐕 Dog Breeds</Text>

          <Image source={require('@/assets/images/dog-breeds.png')} style={[styles.secondimage, { width: screenWidth * 0.85 }]} />
          <Text style={styles.text}>
            Dogs come in many breeds, each with unique traits. Here are some popular breeds:
            <Text style={styles.boldText}> Labrador Retrievers</Text>: Known for their friendly and outgoing nature, Labradors make great family pets.
            <Text style={styles.boldText}> German Shepherds</Text>: Intelligent and versatile, they're often used as working dogs, especially in police and military roles.
            <Text style={styles.boldText}> Bulldogs</Text>: With their calm and courageous nature, Bulldogs are great companions for those with a laid-back lifestyle.
          </Text>


          <Text style={styles.sectionTitle}>📚 Understanding Dog Temperaments</Text>
          <Text style={styles.text}>
            Some breeds are more active and need more exercise, while others prefer lounging around the house. It's important to choose a breed that matches your lifestyle and activity level.
            For example, <Text style={styles.boldText}>Border Collies</Text> are highly energetic and require lots of mental stimulation and physical activity.
          </Text>
        </View>
      )}

      {activeTab === 'Health' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💉 Health Tips for Dogs</Text>
          <Image source={require('@/assets/images/dog-health.png')} style={[styles.secondimage, { width: screenWidth * 0.85 }]} />

          <Text style={styles.text}>
            Regular vet visits are key to maintaining your dog’s health. Here are some essential health tips:
          </Text>

          <Text style={styles.boldText}>1. Regular Vet Check-ups:</Text>
          <Text style={styles.text}>
            Make sure to take your dog for an annual vet check-up, including vaccinations and preventative care.
          </Text>

          <Text style={styles.boldText}>2. Maintain a Healthy Weight:</Text>
          <Text style={styles.text}>
            Obesity is a common issue among pets. Keep track of their weight and feed them appropriate portions.
          </Text>

          <Text style={styles.boldText}>3. Oral Health:</Text>
          <Text style={styles.text}>
            Dental care is often overlooked, but it’s crucial for your dog’s overall health. Brush your dog's teeth regularly and provide chew toys to help reduce plaque buildup.
          </Text>

          <Text style={styles.boldText}>4. Exercise:</Text>
          <Text style={styles.text}>
            Regular exercise helps to maintain your dog’s physical and mental health. The amount of exercise depends on their breed and age.
          </Text>

          <Text style={styles.boldText}>5. Mental Stimulation:</Text>
          <Text style={styles.text}>
            Engage your dog with toys, puzzles, and training exercises to keep them mentally sharp.
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', color: '#333', padding: 10 },
  tabContainer: { flexDirection: 'row', marginBottom: 20, justifyContent: 'space-around', padding: 10 },
  tabButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    width: '30%',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: 'orange',
    fontWeight: '700',
  },
  tabText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#3d3d5c',  padding:'10',  },
  text: { fontSize: 16, color: '#444', lineHeight: 22, padding: 10 },
  image: { height: 200, borderRadius: 10, marginTop: 10, display: 'flex', alignSelf: 'center' },
  secondimage: { height: 200, borderRadius: 10, marginTop: 10, display: 'flex', alignSelf: 'center' },
  boldText: { fontWeight: '800', color: 'orange' },
});

export default Education;
