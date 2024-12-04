from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase, force_authenticate, APIClient
from .models import Hub
from django.utils import timezone
from .models import Event

# Create your tests here.
class EventAPITests(APITestCase):

    # Function to set up event data by creating a test user and making a personal event for them.
    def setUp(self):
        self.user = User.objects.create_user(username='testusername', password='testpassword')
        self.user2 = User.objects.create_user(username='testusername2', password='testpassword2')
        self.robotics_hub = Hub.objects.create(name="Robotics", description="Robotics indeed", owner=self.user)
        self.swimming_hub = Hub.objects.create(name="Swimming", description="Swimming indeed", owner=self.user2)
        self.fencing_hub = Hub.objects.create(name="Fencing", description="Fencing indeed", owner=self.user2)
        self.fencing_hub.mods.set([self.user])
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)  

        # Use helper method to create initial events
        self.event1 = self.create_event(title="Robotics Competition", 
                                       location="UNLV TBE", 
                                       description="Compete for cash prize",
                                       start_time="2024-10-31T10:00:00Z",
                                       end_time="2024-10-31T11:00:00Z",
                                       color="#000000",
                                       hub=self.robotics_hub,
                                       isPersonal=False)
        self.event2 = self.create_event(title="New restaurant on Maryland", 
                                       location="Maryland Pkwy", 
                                       description="Chinese food",
                                       start_time="2024-10-29T11:00:00Z",
                                       end_time=None,
                                       color="#FFFFFF",
                                       hub=None,
                                       isPersonal=True)
    
    # Function to create an event. This will act as a helper method
    def create_event(self, title, location, description, start_time, end_time, color, hub, isPersonal):
        return Event.objects.create(author=self.user, title=title, location=location, description=description, start_time=start_time, end_time=end_time, color=color, hub=hub, isPersonal=isPersonal)

    # Test if all events can be listed in the API
    def test_event_list(self):
        response = self.client.get(reverse('event-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2) 
        self.assertEqual(response.data[0]['title'], "Robotics Competition")
        self.assertEqual(response.data[1]['title'], "New restaurant on Maryland")

    # Check if API can create new event
    def test_create_event(self):
        data = {
                'title': 'Interview', 
                'location': "UNLV TBE-B172",
                'description': "Bring resume and suit. You got this!",
                'start_time' : "2024-10-29T1:00:00Z",
                'end_time' : "2024-10-29T1:30:00Z",
                'color': "#FFFFFF",
                'hub': None,
                'isPersonal': True
                }
        
        response = self.client.post(reverse('event-create'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)  
        self.assertEqual(Event.objects.count(), 3)  
        expected_start_time = timezone.datetime.strptime("2024-10-29T1:00:00Z", "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=timezone.utc)
        expected_end_time = timezone.datetime.strptime("2024-10-29T1:30:00Z", "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=timezone.utc)

        # Other assertions for the created event
        new_event = Event.objects.latest('id')
        self.assertEqual(new_event.title, 'Interview')
        self.assertEqual(new_event.location, 'UNLV TBE-B172')
        self.assertEqual(new_event.description, 'Bring resume and suit. You got this!')
        self.assertEqual(new_event.start_time, expected_start_time)
        self.assertEqual(new_event.end_time, expected_end_time)
        self.assertEqual(new_event.color, "#FFFFFF")
        self.assertEqual(new_event.hub, None)
        self.assertEqual(new_event.isPersonal, True)

        # Test with data that has a hub that the user is an owner of
        data2 = {**data, 'hub': self.robotics_hub.id, 'isPersonal': False}
        response = self.client.post(reverse('event-create'), data2, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)  

        # Test with data that has a hub that the user is a moderator of
        data3 = {**data, 'hub': self.fencing_hub.id, 'isPersonal': False}
        response = self.client.post(reverse('event-create'), data3, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED) 

    def test_create_event_bad_data(self):
        correct_data = {
                'title': 'title', 
                'location': "",
                'description': "",
                'start_time' : "2024-10-29T1:00:00Z",
                'end_time' : "2024-10-29T1:30:00Z",
                'color': "#FFFFFF",
                'hub': None,
                'isPersonal': True
                }
        
        # Title is missing
        missing_title_data = {**correct_data, 'title': "", } 
        response = self.client.post(reverse('event-create'), missing_title_data, format='json') 
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)  

        # Start time is missing
        missing_start_time_data = {**correct_data, 'start_time': "" } 
        response = self.client.post(reverse('event-create'), missing_start_time_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST) 

        # End time is earlier than start time   
        incorrect_timing_data = {**correct_data, 'end_time': "2024-10-28T1:00:00Z" } 
        response = self.client.post(reverse('event-create'), incorrect_timing_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST) 

        # K is not a valid hex char
        invalid_hex_color_data = {**correct_data, 'color': "#ABCDEK"} 
        response = self.client.post(reverse('event-create'), invalid_hex_color_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST) 

        # No hub and isPersonal is false
        no_hub_false_isPersonal_data = {**correct_data, 'isPersonal': False} 
        response = self.client.post(reverse('event-create'), no_hub_false_isPersonal_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST) 

        # There is a hub and isPersonal is true
        hub_true_isPersonal_data = {**correct_data, 'hub': self.robotics_hub.id} 
        response = self.client.post(reverse('event-create'), hub_true_isPersonal_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST) 

        # User is not an owner or moderator of a specific hub
        not_owner_data = {**correct_data, 'hub': self.swimming_hub.id} 
        response = self.client.post(reverse('event-create'), not_owner_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST) 

    def test_update_event(self):
        data = {'title': 'UNLV Robotics Competition', 
                'location': "Thomas and Mack Center",
                'description': "Robotics event date and location changed",
                'start_time' : "2024-10-30T10:00:00Z",
                'end_time' : "2024-10-30T11:30:00Z",
                'color': "#000000",
                }
        response = self.client.put(reverse('event-update', args=[self.event1.id]),  data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)  # Expect 200 OK for successful update
        self.assertEqual(Event.objects.count(), 2)  
        expected_start_time = timezone.datetime.strptime("2024-10-30T10:00:00Z", "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=timezone.utc)
        expected_end_time = timezone.datetime.strptime("2024-10-30T11:30:00Z", "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=timezone.utc)

        # Other assertions for the created event
        updated_event = Event.objects.get(id=self.event1.id)
        self.assertEqual(updated_event.title, 'UNLV Robotics Competition')
        self.assertEqual(updated_event.location, "Thomas and Mack Center")
        self.assertEqual(updated_event.description, "Robotics event date and location changed")
        self.assertEqual(updated_event.start_time, expected_start_time)
        self.assertEqual(updated_event.end_time, expected_end_time)
        self.assertEqual(updated_event.color, "#000000")

    def test_update_event_bad_data(self):
        correct_data = {
                'title': 'title', 
                'location': "",
                'description': "",
                'start_time' : "2024-10-29T1:00:00Z",
                'end_time' : "2024-10-29T1:30:00Z",
                'color': "#FFFFFF",
                }
        
        # Title is missing
        missing_title_data = {**correct_data, 'title': "", } 
        response = self.client.put(reverse('event-update', args=[self.event1.id]), missing_title_data, format='json') 
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)  

        # Start time is missing
        missing_start_time_data = {**correct_data, 'start_time': "", } 
        response = self.client.put(reverse('event-update', args=[self.event1.id]), missing_start_time_data, format='json') 
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)  

        # End time is earlier than start time
        incorrect_timing_data = {**correct_data, 'end_time': "2024-10-28T1:00:00Z" } 
        response = self.client.put(reverse('event-update', args=[self.event1.id]), incorrect_timing_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST) 

        # K is not a valid hex char
        invalid_hex_color_data = {**correct_data, 'color': "#ABCDEK"} 
        response = self.client.put(reverse('event-update', args=[self.event1.id]), invalid_hex_color_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST) 

    def test_delete_event(self):
        response = self.client.delete(reverse('event-delete', args=[self.event1.id]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Event.objects.count(), 1)  
        self.assertFalse(Event.objects.filter(id=self.event1.id).exists())
        
    def test_delete_nonexistent_event(self):
        response = self.client.delete(reverse('event-delete', args=[self.event1.id]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Event.objects.count(), 1)  
        self.assertFalse(Event.objects.filter(id=self.event1.id).exists())

        # Event 1 no longer exists, so NOT FOUND expected
        response = self.client.delete(reverse('event-delete', args=[self.event1.id]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND) 
        