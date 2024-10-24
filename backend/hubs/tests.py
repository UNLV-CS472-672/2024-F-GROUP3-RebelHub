from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase, APIRequestFactory, force_authenticate
from .models import Hub
from .views import HubByID, HubList, HubJoined, HubOwned, HubModerating, HubCreate, HubDelete, HubUpdate, HubAddMember, HubRemoveMember, HubAddModerator, HubRemoveModerator

# Create your tests here.

class HubAPITests(APITestCase):

    def setUp(self):
        self.factory = APIRequestFactory()

    def test_get_hub(self):
        """
        Make sure we can make a call to get a hub's details by providing the id
        """
        user = User.objects.create_user(username="Test HUB User", password="testpass")
        hub = Hub.objects.create(name="TEST HUB", description="A HUB MADE IN TESTING", owner=user)

        view = HubByID.as_view()
        request = self.factory.get(f"/hubs/{hub.id}/")
        response = view(request, id=hub.id)
        data = response.data

        self.assertEqual(response.status_code, status.HTTP_200_OK) #200 we can get a hub
        self.assertEqual(data["name"], "TEST HUB") #make sure names match up
        self.assertEqual(data["description"], "A HUB MADE IN TESTING") #make sure descriptions match up

    def test_get_hub_private(self):
        """
        Make sure only authenticated users can retrieve a private hub by id.
        """
        user = User.objects.create_user(username="Test HUB User", password="testpass")
        hub = Hub.objects.create(name="TEST HUB", description="A PRIVATE HUB MADE IN TESTING", private_hub=True, owner=user)

        dummy_user = User.objects.create_user(username="Test HUB User 2", password="testpass")

        view = HubByID.as_view()
        request = self.factory.get(f"/hubs/{hub.id}/")
        response = view(request, id=hub.id)
        data = response.data

        self.assertEqual(len(data), 0) #i expected 0 but really the count is one its just NOT a hub i will fix this


        view = HubByID.as_view()
        request = self.factory.get(f"/hubs/{hub.id}/")
        force_authenticate(request, user=dummy_user)
        response = view(request, id=hub.id)
        data = response.data

        self.assertEqual(len(data), 1)





    def test_get_hublist(self):
        """
        Make sure we can make a call to retrieve all hub's data
        """
        user = User.objects.create_user(username="Test HUB User", password="testpass")
        hub = Hub.objects.create(name="TEST HUB", description="A HUB MADE IN TESTING", owner=user)
        hub2 = Hub.objects.create(name="TEST HUB 2", description="A SECOND HUB MADE IN TESTING", owner=user)
        hub3 = Hub.objects.create(name="TEST HUB 3", description="A PRIVATE HUB MADE IN TESTING", private_hub=True, owner=user)

        view = HubList.as_view()
        request = self.factory.get(f"/hubs/")
        response = view(request)
        data = response.data


        self.assertEqual(response.status_code, status.HTTP_200_OK) #200 we can get all the hubs
        self.assertEqual(len(data), 2) #make sure we are seeing out two hubs. private hub should not be seen here

        #make sure data matches up with whats expected
        self.assertEqual(data[0]["name"], "TEST HUB")
        self.assertEqual(data[1]["name"], "TEST HUB 2")
        self.assertEqual(data[0]["description"], "A HUB MADE IN TESTING")
        self.assertEqual(data[1]["description"], "A SECOND HUB MADE IN TESTING")

    def test_get_hubjoined(self):
        """
        Make sure a user can get the hubs they have joined.
        """
        user = User.objects.create_user(username="Test HUB User", password="testpass")
        hub = Hub.objects.create(name="TEST HUB", description="A HUB MADE IN TESTING", owner=user)
        hub2 = Hub.objects.create(name="TEST HUB 2", description="A SECOND HUB MADE IN TESTING", owner=user)

        user2 = User.objects.create_user(username="Test HUB User 2", password="testpass")
        user3 = User.objects.create_user(username="Test HUB User 3", password="testpass")

        view = HubAddMember.as_view() 
        request = self.factory.put(f"/hubs/{hub.id}/join/")
        force_authenticate(request, user=user2)
        response = view(request, id=hub.id)

        view = HubJoined.as_view()
        request = self.factory.get("/hubs/joined")
        force_authenticate(request, user=user2)
        response = view(request)
        data = response.data

        self.assertEqual(response.status_code, status.HTTP_200_OK) #200 user made request sucessfully
        self.assertEqual(len(data), 1) # make sure user is only seeing the one hub that they have joined

        request = self.factory.get("/hubs/joined")
        force_authenticate(request, user=user3)
        response = view(request)
        data = response.data

        self.assertEqual(response.status_code, status.HTTP_200_OK) #200 user made request sucessfully
        self.assertEqual(len(data), 0)


    def test_create_hub(self):
        """
        Make sure an authenticated user can createa a hub
        """
        dummy_hub = {"name" : "TEST HUB", "description" : "A HUB MADE IN TESTING"}
        user = User.objects.create_user(username="Test HUB User", password="testpass")
        view = HubCreate.as_view()
        request = self.factory.post("/hubs/create", dummy_hub, format="json")
        force_authenticate(request, user=user)
        response = view(request)
        
        

        self.assertEqual(response.status_code, status.HTTP_201_CREATED) #201 successfully created a hub
        self.assertEqual(Hub.objects.count(), 1) #make sure hub got created and exists in db

    def test_create_private_hub(self):
        """
        Make sure an authenticated user can createa a PRIVATE hub
        """
        dummy_hub = {"name" : "TEST HUB", "description" : "A HUB MADE IN TESTING", "private_hub" : True}
        user = User.objects.create_user(username="Test HUB User", password="testpass")
        view = HubCreate.as_view()
        request = self.factory.post("/hubs/create", dummy_hub, format="json")
        force_authenticate(request, user=user)
        response = view(request)
        
        

        self.assertEqual(response.status_code, status.HTTP_201_CREATED) #201 successfully created a hub
        self.assertEqual(Hub.objects.count(), 1) #make sure hub got created and exists in db


    def test_create_hub_noauth(self):
        """
        Make sure a non authenticated user cannot createa a hub
        """
        dummy_hub = {"name" : "TEST HUB", "description" : "A HUB MADE IN TESTING"}
        user = User.objects.create_user(username="Test HUB User", password="testpass")
        view = HubCreate.as_view()
        request = self.factory.post("/hubs/create", dummy_hub, format="json")
        response = view(request)
        
        

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN) #403 forbidden since user is not authorized
        self.assertEqual(Hub.objects.count(), 0) #make sure hub never got created

    def test_delete_hub(self):
        """
        Make sure a user can delete a hub they created
        """
        dummy_hub = {"name" : "TEST HUB", "description" : "A HUB MADE IN TESTING"}
        user = User.objects.create_user(username="Test HUB User", password="testpass")
        view = HubCreate.as_view()
        request = self.factory.post("/hubs/create", dummy_hub, format="json")
        force_authenticate(request, user=user)
        response = view(request)

        data = response.data
        hub = Hub.objects.get(name=data["name"])

        view = HubDelete.as_view()
        request = self.factory.delete(f"/hubs/{hub.id}/delete/")
        force_authenticate(request, user=user)
        response = view(request, id=hub.id)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT) #204 sucessfully deleted a hub
        self.assertEqual(Hub.objects.count(), 0) #make sure hub no longer exists.

    def test_delete_hub_notowner(self):
        """
        Make sure a user cannot delete a hub they did not create
        """
        dummy_hub = {"name" : "TEST HUB", "description" : "A HUB MADE IN TESTING"}
        user = User.objects.create_user(username="Test HUB User", password="testpass")
        view = HubCreate.as_view()
        request = self.factory.post("/hubs/create", dummy_hub, format="json")
        force_authenticate(request, user=user)
        response = view(request)

        data = response.data
        hub = Hub.objects.get(name=data["name"])

        user2 = User.objects.create_user(username="Test HUB User 2", password="testpass")
        view = HubDelete.as_view()
        request = self.factory.delete(f"/hubs/{hub.id}/delete/")
        force_authenticate(request, user=user2)
        response = view(request, id=hub.id)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN) #403 user cant delete cus they aren't owner.
        self.assertEqual(Hub.objects.count(), 1) #make sure first hub still exists.

    def test_updating_hub(self):
        """
        Make sure a user can update their hub name and description
        """
        dummy_hub = {"name" : "TEST HUB", "description" : "A HUB MADE IN TESTING"}
        user = User.objects.create_user(username="Test HUB User", password="testpass")
        view = HubCreate.as_view()
        request = self.factory.post("/hubs/create", dummy_hub, format="json")
        force_authenticate(request, user=user)
        response = view(request)
        data = response.data
        hub = Hub.objects.get(name=data["name"])

        #make sure the first hub has the data we provided
        self.assertEqual(hub.name, "TEST HUB") 
        self.assertEqual(hub.description, "A HUB MADE IN TESTING")
        self.assertEqual(Hub.objects.count(), 1)

        updated_hub = {"name" : "NEW NAME", "description" : "NEW DESC"}
        view = HubUpdate.as_view()
        request = self.factory.put(f"/hubs/{hub.id}/update/", updated_hub, format="json")
        force_authenticate(request, user=user)
        response = view(request, id=hub.id)
        data = response.data
        hub = Hub.objects.get(name=data["name"])

        self.assertEqual(response.status_code, status.HTTP_200_OK) #200 user was able to perform update
        self.assertEqual(hub.name, "NEW NAME") #make sure hub now has a new name
        self.assertEqual(hub.description, "NEW DESC") #make sure hub now has a new description
        self.assertEqual(Hub.objects.count(), 1) #make sure hub count is still 1, none were deleted or created.

    def test_join_hub(self):
        """
        Make sure an authenticated user can join a hub
        """
        dummy_hub = {"name" : "TEST HUB", "description" : "A HUB MADE IN TESTING"}
        user = User.objects.create_user(username="Test HUB User", password="testpass")
        view = HubCreate.as_view()
        request = self.factory.post("/hubs/create", dummy_hub, format="json")
        force_authenticate(request, user=user)
        response = view(request)

        data = response.data
        hub = Hub.objects.get(name=data["name"])

        user2 = User.objects.create_user(username="Test HUB User 2", password="testpass")
        view = HubAddMember.as_view() 
        request = self.factory.put(f"/hubs/{hub.id}/join/")
        force_authenticate(request, user=user2)
        response = view(request, id=hub.id)

        self.assertEqual(response.status_code, status.HTTP_200_OK) #200 user2 was able to join the hub.
        self.assertEqual(hub.members.count(), 2) #make sure hub count is now 2, owner & user2

    def test_join_hub_repeatjoin(self):
        """
        Make sure a user cannot join a hub they already have joined
        """
        dummy_hub = {"name" : "TEST HUB", "description" : "A HUB MADE IN TESTING"}
        user = User.objects.create_user(username="Test HUB User", password="testpass")
        view = HubCreate.as_view()
        request = self.factory.post("/hubs/create", dummy_hub, format="json")
        force_authenticate(request, user=user)
        response = view(request)

        data = response.data
        hub = Hub.objects.get(name=data["name"])

        view = HubAddMember.as_view() 

        request = self.factory.put(f"/hubs/{hub.id}/join/")
        force_authenticate(request, user=user)
        response = view(request, id=hub.id)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST) #400 user can't join a hub twice. (owner auto joins a hub)

    def test_leave_hub(self):
        """
        Make sure a user can leave a hub they are a member of
        """
        dummy_hub = {"name" : "TEST HUB", "description" : "A HUB MADE IN TESTING"}
        user = User.objects.create_user(username="Test HUB User", password="testpass")
        view = HubCreate.as_view()
        request = self.factory.post("/hubs/create", dummy_hub, format="json")
        force_authenticate(request, user=user)
        response = view(request)

        data = response.data
        hub = Hub.objects.get(name=data["name"])

        user2 = User.objects.create_user(username="Test HUB User 2", password="testpass")
        view = HubAddMember.as_view() 
        request = self.factory.put(f"/hubs/{hub.id}/join/")
        force_authenticate(request, user=user2)
        response = view(request, id=hub.id)

        self.assertEqual(hub.members.count(), 2) #make sure user joined the hub

        view = HubRemoveMember.as_view()
        request = self.factory.put(f"/hubs/{hub.id}/leave/")
        force_authenticate(request, user=user2)
        response = view(request, id=hub.id)

        self.assertEqual(response.status_code, status.HTTP_200_OK) #200 user sucessfully left hub
        self.assertEqual(hub.members.count(), 1) #make sure hub count went from 2 to 1

    def test_leave_notamember(self):
        """
        Make sure a user cannot leave a hub they are not a member of
        """
        dummy_hub = {"name" : "TEST HUB", "description" : "A HUB MADE IN TESTING"}
        user = User.objects.create_user(username="Test HUB User", password="testpass")
        view = HubCreate.as_view()
        request = self.factory.post("/hubs/create", dummy_hub, format="json")
        force_authenticate(request, user=user)
        response = view(request)

        data = response.data
        hub = Hub.objects.get(name=data["name"])

        user2 = User.objects.create_user(username="Test HUB User 2", password="testpass")

        view = HubRemoveMember.as_view()
        request = self.factory.put(f"/hubs/{hub.id}/leave/")
        force_authenticate(request, user=user2)
        response = view(request, id=hub.id)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST) #400 user can't leave if not a member

    def test_leave_owner(self):
        """
        Make sure a hub owner cannot leave the hub. (they must delete it)
        """
        dummy_hub = {"name" : "TEST HUB", "description" : "A HUB MADE IN TESTING"}
        user = User.objects.create_user(username="Test HUB User", password="testpass")
        view = HubCreate.as_view()
        request = self.factory.post("/hubs/create", dummy_hub, format="json")
        force_authenticate(request, user=user)
        response = view(request)

        data = response.data
        hub = Hub.objects.get(name=data["name"])

        view = HubRemoveMember.as_view()
        request = self.factory.put(f"/hubs/{hub.id}/leave/")
        force_authenticate(request, user=user)
        response = view(request, id=hub.id)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST) #400 owner cannot leave hub. 
        self.assertEqual(hub.members.count(), 1) #make sure hub count stays at 1

    def test_add_moderator(self):
        """
        Make sure a hub owner can add a moderator.
        """
        dummy_hub = {"name" : "TEST HUB", "description" : "A HUB MADE IN TESTING"}
        user = User.objects.create_user(username="Test HUB User", password="testpass")
        view = HubCreate.as_view()
        request = self.factory.post("/hubs/create", dummy_hub, format="json")
        force_authenticate(request, user=user)
        response = view(request)

        data = response.data
        hub = Hub.objects.get(name=data["name"])
        HUBSID = hub.id

        user2 = User.objects.create_user(username="Test HUB User 2", password="testpass")
        view = HubAddMember.as_view() 
        request = self.factory.put(f"/hubs/{hub.id}/join")
        force_authenticate(request, user=user2)
        response = view(request, id=hub.id)

        self.assertEqual(hub.members.count(), 2) #make sure user joined the hub



        view = HubAddModerator.as_view()
        request_data = {"user_id": user2.id}
        request = self.factory.put(f"/hubs/{hub.id}/mods/add", request_data, format="json")
        force_authenticate(request, user=user)
        response = view(request, id=hub.id)

        self.assertEqual(response.status_code, status.HTTP_200_OK) #200 owner added a mod
        self.assertIn(user2, hub.mods.all()) #make sure new mod is in hubs mods

    def test_remove_moderator(self):
        """
        Make sure a hub owner can remove a moderator.
        """
        dummy_hub = {"name" : "TEST HUB", "description" : "A HUB MADE IN TESTING"}
        user = User.objects.create_user(username="Test HUB User", password="testpass")
        view = HubCreate.as_view()
        request = self.factory.post("/hubs/create", dummy_hub, format="json")
        force_authenticate(request, user=user)
        response = view(request)

        data = response.data
        hub = Hub.objects.get(name=data["name"])
        HUBSID = hub.id

        user2 = User.objects.create_user(username="Test HUB User 2", password="testpass")
        view = HubAddMember.as_view() 
        request = self.factory.put(f"/hubs/{hub.id}/join")
        force_authenticate(request, user=user2)
        response = view(request, id=hub.id)

        self.assertEqual(hub.members.count(), 2) #make sure user joined the hub



        view = HubAddModerator.as_view()
        request_data = {"user_id": user2.id}
        request = self.factory.put(f"/hubs/{hub.id}/mods/add", request_data, format="json")
        force_authenticate(request, user=user)
        response = view(request, id=hub.id)

        
        self.assertIn(user2, hub.mods.all()) #make sure user2 is added to mods

        self.assertEqual(hub.mods.count(), 1)

        view = HubRemoveModerator.as_view()
        request_data = {"user_id": user2.id}
        request = self.factory.put(f"/hubs/{hub.id}/mods/remove", request_data, format="json")
        force_authenticate(request, user=user)
        response = view(request, id=hub.id)


        self.assertEqual(hub.mods.count(), 0)

