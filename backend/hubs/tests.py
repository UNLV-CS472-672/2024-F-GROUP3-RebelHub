from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase, APIRequestFactory, force_authenticate
from .models import Hub
from .views import HubByID, HubList, HubJoined, HubOwned, HubModerating, HubCreate, HubDelete, HubUpdate, HubAddMember, HubAddPendingMember, HubAddMemberFromPending, HubRemoveMember, HubRemoveMemberFromPending, HubRemovePendingMember, HubAddModerator, HubRemoveModerator, HubKickMember

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

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND) #404 because unauth user cannot see private hubs.


        view = HubByID.as_view()
        request = self.factory.get(f"/hubs/{hub.id}/")
        force_authenticate(request, user=dummy_user)
        response = view(request, id=hub.id)
        data = response.data

        self.assertEqual(response.status_code, status.HTTP_200_OK) #200 auth user can see a private hub.
        self.assertEqual(data["name"], "TEST HUB") #dummy user can see the private hub

    def test_get_hublist(self):
        """
        Make sure we can make a call to retrieve all hub's data
        """
        user = User.objects.create_user(username="Test HUB User", password="testpass")
        hub = Hub.objects.create(name="TEST HUB", description="A HUB MADE IN TESTING", owner=user)
        hub2 = Hub.objects.create(name="TEST HUB 2", description="A SECOND HUB MADE IN TESTING", private_hub=True, owner=user)

        view = HubList.as_view()
        request = self.factory.get(f"/hubs/")
        response = view(request)
        data = response.data


        self.assertEqual(response.status_code, status.HTTP_200_OK) #200 we can get all the hubs
        self.assertEqual(len(data), 2) #make sure we are seeing two hubs.

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
        request = self.factory.get("/hubs/joined/")
        force_authenticate(request, user=user2)
        response = view(request)
        data = response.data

        self.assertEqual(response.status_code, status.HTTP_200_OK) #200 user made request sucessfully
        self.assertEqual(len(data), 1) # make sure user is only seeing the one hub that they have joined

        request = self.factory.get("/hubs/joined/")
        force_authenticate(request, user=user3)
        response = view(request)
        data = response.data

        self.assertEqual(response.status_code, status.HTTP_200_OK) #200 user made request sucessfully
        self.assertEqual(len(data), 0)

    def test_get_hubowned(self):
        """
        Make sure a user can get the hubs they own.
        """
        user = User.objects.create_user(username="Test HUB User", password="testpass")
        user2 = User.objects.create_user(username="Test HUB User 2", password="testpass")
        user3 = User.objects.create_user(username="Test HUB User 3", password="testpass")
        hub = Hub.objects.create(name="TEST HUB", description="A HUB MADE IN TESTING", owner=user)
        hub2 = Hub.objects.create(name="TEST HUB 2", description="A SECOND HUB MADE IN TESTING", owner=user)
        hub3 = Hub.objects.create(name="TEST HUB 3", description="A THIRD HUB MADE IN TESTING", owner=user2)

        view = HubOwned.as_view() 
        request = self.factory.get("/hubs/owned/")
        force_authenticate(request, user=user)
        response = view(request)
        data = response.data

        self.assertEqual(response.status_code, status.HTTP_200_OK) #200 user made request sucessfully
        self.assertEqual(len(data), 2) # make sure user is only seeing the two hubs that they have created 


        view = HubOwned.as_view()
        request = self.factory.get("/hubs/owned/")
        force_authenticate(request, user=user2)
        response = view(request)
        data = response.data

        self.assertEqual(response.status_code, status.HTTP_200_OK) #200 user made request sucessfully
        self.assertEqual(len(data), 1) # make sure user is only seeing the one hub that they have created

        view = HubOwned.as_view()
        request = self.factory.get("/hubs/owned/")
        force_authenticate(request, user=user3)
        response = view(request)
        data = response.data

        self.assertEqual(response.status_code, status.HTTP_200_OK) #200 user made request sucessfully
        self.assertEqual(len(data), 0) # user3 owns no hubs so we get empty list

    def test_get_hubmodding(self):
        """
        Make sure a user get the hubs they are moderating.
        """

        #User owns hub, hub2
        #User 3 owns hub3
        #User 2 is modding hub, and hub3
        user = User.objects.create_user(username="Test HUB User", password="testpass")
        user2 = User.objects.create_user(username="Test HUB User 2", password="testpass")
        user3 = User.objects.create_user(username="Test HUB User 3", password="testpass")
        hub = Hub.objects.create(name="TEST HUB", description="A HUB MADE IN TESTING", owner=user)
        hub2 = Hub.objects.create(name="TEST HUB 2", description="A SECOND HUB MADE IN TESTING", owner=user)
        hub3 = Hub.objects.create(name="TEST HUB 3", description="A THIRD HUB MADE IN TESTING", owner=user3)

        view = HubAddMember.as_view() 
        request = self.factory.put(f"/hubs/{hub.id}/join/")
        force_authenticate(request, user=user2)
        response = view(request, id=hub.id)

        self.assertEqual(hub.members.count(), 2) #make sure user joined the hub

        view = HubAddMember.as_view() 
        request = self.factory.put(f"/hubs/{hub.id}/join/")
        force_authenticate(request, user=user2)
        response = view(request, id=hub3.id)

        self.assertEqual(hub3.members.count(), 2) #make sure user joined the hub

        view = HubAddModerator.as_view()
        request_data = {"user_id": user2.id}
        request = self.factory.put(f"/hubs/{hub.id}/mods/add/", request_data, format="json")
        force_authenticate(request, user=user)
        response = view(request, id=hub.id)

        view = HubAddModerator.as_view()
        request_data = {"user_id": user2.id}
        request = self.factory.put(f"/hubs/{hub3.id}/mods/add/", request_data, format="json")
        force_authenticate(request, user=user3)
        response = view(request, id=hub3.id)


        view = HubModerating.as_view()
        request = self.factory.get("/hubs/modding/")
        force_authenticate(request, user=user2)
        response = view(request)
        data = response.data

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(data), 2)

    def test_create_hub(self):
        """
        Make sure an authenticated user can createa a hub
        """
        dummy_hub = {"name" : "TEST HUB", "description" : "A HUB MADE IN TESTING"}
        user = User.objects.create_user(username="Test HUB User", password="testpass")
        view = HubCreate.as_view()
        request = self.factory.post("/hubs/create/", dummy_hub, format="json")
        force_authenticate(request, user=user)
        response = view(request)
        
        

        self.assertEqual(response.status_code, status.HTTP_201_CREATED) #201 successfully created a hub
        self.assertEqual(Hub.objects.count(), 1) #make sure hub got created and exists in db

    def test_create_bad_hub(self):
        """
        Make sure a user cannot create a bad hub
        """
        bad_hub = {"a_hub_name": "Not A Real Hub Name", "no_desc": "Not A Real Desc"}
        missing_hub = {"name" : "Only Name"}
        missing_hub2 = {"description" : "Only Description"}
        #fake_fields hub GETS CREATED. only name and description are considered. private_hub would also be considered.
        fake_fields = {"name" : "Good Name", "description": "good description", "created_at": "today", "about" : "about field doesn't exist"}
        user = User.objects.create_user(username="Test HUB User", password="testpass")

        view = HubCreate.as_view()

        request = self.factory.post("/hubs/create/", bad_hub, format="json")
        force_authenticate(request, user=user)
        response = view(request)
        data = response.data
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        request = self.factory.post("/hubs/create/", missing_hub, format="json")
        force_authenticate(request, user=user)
        response = view(request)
        data = response.data
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        request = self.factory.post("/hubs/create/", missing_hub2, format="json")
        force_authenticate(request, user=user)
        response = view(request)
        data = response.data
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        request = self.factory.post("/hubs/create/", fake_fields, format="json")
        force_authenticate(request, user=user)
        response = view(request)
        data = response.data

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_private_hub(self):
        """
        Make sure an authenticated user can createa a PRIVATE hub
        """
        dummy_hub = {"name" : "TEST HUB", "description" : "A HUB MADE IN TESTING", "private_hub" : True}
        user = User.objects.create_user(username="Test HUB User", password="testpass")
        view = HubCreate.as_view()
        request = self.factory.post("/hubs/create/", dummy_hub, format="json")
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
        request = self.factory.post("/hubs/create/", dummy_hub, format="json")
        response = view(request)
        
        

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED) #401 since user is not authorized
        self.assertEqual(Hub.objects.count(), 0) #make sure hub never got created

    def test_delete_hub(self):
        """
        Make sure a user can delete a hub they created
        """
        dummy_hub = {"name" : "TEST HUB", "description" : "A HUB MADE IN TESTING"}
        user = User.objects.create_user(username="Test HUB User", password="testpass")
        view = HubCreate.as_view()
        request = self.factory.post("/hubs/create/", dummy_hub, format="json")
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
        request = self.factory.post("/hubs/create/", dummy_hub, format="json")
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
        request = self.factory.post("/hubs/create/", dummy_hub, format="json")
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


    def test_bad_updating_hub(self):
        """
        Make sure a user can't update their hub name and description with bad data
        """
        dummy_hub = {"name" : "TEST HUB", "description" : "A HUB MADE IN TESTING"}
        user = User.objects.create_user(username="Test HUB User", password="testpass")
        view = HubCreate.as_view()
        request = self.factory.post("/hubs/create/", dummy_hub, format="json")
        force_authenticate(request, user=user)
        response = view(request)
        data = response.data
        hub = Hub.objects.get(name=data["name"])

        #make sure the first hub has the data we provided
        self.assertEqual(hub.name, "TEST HUB") 
        self.assertEqual(hub.description, "A HUB MADE IN TESTING")
        self.assertEqual(Hub.objects.count(), 1)

        updated_hub = {"name" : "", "description" : ""}
        view = HubUpdate.as_view()
        request = self.factory.put(f"/hubs/{hub.id}/update/", updated_hub, format="json")
        force_authenticate(request, user=user)
        response = view(request, id=hub.id)
        data = response.data

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST) #400 user was not able to perform update
        self.assertNotEqual(hub.name, "") #make sure hub does not have a new name
        self.assertNotEqual(hub.description, "") #make sure hub does not have a new description
        self.assertEqual(Hub.objects.count(), 1) #make sure hub count is still 1, none were deleted or created.



    def test_mod_updating_hub(self):
        """
        Make sure a user moderator can update their hub name and description
        """
        dummy_hub = {"name" : "TEST HUB", "description" : "A HUB MADE IN TESTING"}
        user = User.objects.create_user(username="Test HUB User", password="testpass")
        user2 = User.objects.create_user(username="Test HUB User 2", password="testpass")
        view = HubCreate.as_view()
        request = self.factory.post("/hubs/create/", dummy_hub, format="json")
        force_authenticate(request, user=user)
        response = view(request)
        data = response.data
        hub = Hub.objects.get(name=data["name"])

        #make sure the first hub has the data we provided
        self.assertEqual(hub.name, "TEST HUB") 
        self.assertEqual(hub.description, "A HUB MADE IN TESTING")
        self.assertEqual(Hub.objects.count(), 1)

        view = HubAddMember.as_view() 
        request = self.factory.put(f"/hubs/{hub.id}/join/")
        force_authenticate(request, user=user2)
        response = view(request, id=hub.id)

        view = HubAddModerator.as_view()
        request_data = {"user_id": user2.id}
        request = self.factory.put(f"/hubs/{hub.id}/mods/add/", request_data, format="json")
        force_authenticate(request, user=user)
        response = view(request, id=hub.id)

        self.assertIn(user2, hub.mods.all())

        updated_hub = {"name" : "NEW NAME", "description" : "NEW DESC"}
        view = HubUpdate.as_view()
        request = self.factory.put(f"/hubs/{hub.id}/update/", updated_hub, format="json")
        force_authenticate(request, user=user2)
        response = view(request, id=hub.id)
        data = response.data
        hub = Hub.objects.get(name=data["name"])

        self.assertEqual(response.status_code, status.HTTP_200_OK) #200 user was able to perform update
        self.assertEqual(hub.name, "NEW NAME") #make sure hub now has a new name
        self.assertEqual(hub.description, "NEW DESC") #make sure hub now has a new description
        self.assertEqual(Hub.objects.count(), 1) #make sure hub count is still 1, none were deleted or created.


    def test_updating_hub_to_public(self):
        """
        Make sure an owner can update their hub to public 
        """
        dummy_hub = {"name" : "TEST HUB", "description" : "A HUB MADE IN TESTING", "private_hub" : True}
        user = User.objects.create_user(username="Test HUB User", password="testpass")
        user2 = User.objects.create_user(username="Test HUB User 2", password="testpass")
        view = HubCreate.as_view()
        request = self.factory.post("/hubs/create/", dummy_hub, format="json")
        force_authenticate(request, user=user)
        response = view(request)
        data = response.data
        hub = Hub.objects.get(name=data["name"])

        #make sure the first hub has the data we provided
        self.assertEqual(hub.name, "TEST HUB") 
        self.assertEqual(hub.description, "A HUB MADE IN TESTING")
        self.assertEqual(hub.private_hub, True)
        self.assertEqual(Hub.objects.count(), 1)

        view = HubAddPendingMember.as_view()
        request = self.factory.put(f"/hubs/{hub.id}/request_join/")
        force_authenticate(request, user=user2)
        response = view(request, id=hub.id)

        self.assertEqual(hub.members.count(), 1)
        self.assertEqual(hub.pending_members.count(), 1)

        updated_hub = {"name" : "NEW NAME", "description" : "NEW DESC", "private_hub" : False}
        view = HubUpdate.as_view()
        request = self.factory.put(f"/hubs/{hub.id}/update/", updated_hub, format="json")
        force_authenticate(request, user=user)
        response = view(request, id=hub.id)
        data = response.data
        hub = Hub.objects.get(name=data["name"])

        self.assertEqual(response.status_code, status.HTTP_200_OK) #200 user was able to perform update
        self.assertEqual(hub.name, "NEW NAME") #make sure hub now has a new name
        self.assertEqual(hub.description, "NEW DESC") #make sure hub now has a new description
        self.assertEqual(hub.members.count(), 2)
        self.assertEqual(hub.pending_members.count(), 0)
        self.assertEqual(Hub.objects.count(), 1) #make sure hub count is still 1, none were deleted or created.



    def test_join_hub(self):
        """
        Make sure an authenticated user can join a hub
        """
        dummy_hub = {"name" : "TEST HUB", "description" : "A HUB MADE IN TESTING"}
        user = User.objects.create_user(username="Test HUB User", password="testpass")
        view = HubCreate.as_view()
        request = self.factory.post("/hubs/create/", dummy_hub, format="json")
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
        request = self.factory.post("/hubs/create/", dummy_hub, format="json")
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
        request = self.factory.post("/hubs/create/", dummy_hub, format="json")
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
        request = self.factory.post("/hubs/create/", dummy_hub, format="json")
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
        request = self.factory.post("/hubs/create/", dummy_hub, format="json")
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
        request = self.factory.post("/hubs/create/", dummy_hub, format="json")
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

        view = HubAddModerator.as_view()
        request_data = {"user_id": user2.id}
        request = self.factory.put(f"/hubs/{hub.id}/mods/add/", request_data, format="json")
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
        request = self.factory.post("/hubs/create/", dummy_hub, format="json")
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



        view = HubAddModerator.as_view()
        request_data = {"user_id": user2.id}
        request = self.factory.put(f"/hubs/{hub.id}/mods/add/", request_data, format="json")
        force_authenticate(request, user=user)
        response = view(request, id=hub.id)

        
        self.assertIn(user2, hub.mods.all()) #make sure user2 is added to mods
        self.assertEqual(hub.mods.count(), 1)

        view = HubRemoveModerator.as_view()
        request_data = {"user_id": user2.id}
        request = self.factory.put(f"/hubs/{hub.id}/mods/remove/", request_data, format="json")
        force_authenticate(request, user=user)
        response = view(request, id=hub.id)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(hub.mods.count(), 0) # mod count now 0
        self.assertNotIn(user2, hub.mods.all()) # user 2 not in mods


    def test_remove_self_moderator(self):
        """
        Make sure a moderator can remove themselves as a moderator.
        """
        dummy_hub = {"name" : "TEST HUB", "description" : "A HUB MADE IN TESTING"}
        user = User.objects.create_user(username="Test HUB User", password="testpass")
        view = HubCreate.as_view()
        request = self.factory.post("/hubs/create/", dummy_hub, format="json")
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

        view = HubAddModerator.as_view()
        request_data = {"user_id": user2.id}
        request = self.factory.put(f"/hubs/{hub.id}/mods/add/", request_data, format="json")
        force_authenticate(request, user=user)
        response = view(request, id=hub.id)

        
        self.assertIn(user2, hub.mods.all()) #make sure user2 is added to mods
        self.assertEqual(hub.mods.count(), 1)

        view = HubRemoveModerator.as_view()
        request_data = {"user_id": user2.id}
        request = self.factory.put(f"/hubs/{hub.id}/mods/remove/", request_data, format="json")
        force_authenticate(request, user=user2) #user2 is removing themselves as a mod
        response = view(request, id=hub.id)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(hub.mods.count(), 0) # mod count now 0
        self.assertNotIn(user2, hub.mods.all()) # user 2 not in mods



    def test_hub_request_join(self):
        """
        Make sure user can request to join private hub 
        """
        dummy_hub = {"name" : "TEST HUB", "description" : "A HUB MADE IN TESTING", "private_hub": True}
        user = User.objects.create_user(username="Test HUB User", password="testpass")
        user2 = User.objects.create_user(username="Test HUB User 2", password="testpass")

        view = HubCreate.as_view()
        request = self.factory.post("/hubs/create/", dummy_hub, format="json")
        force_authenticate(request, user=user)
        response = view(request)

        data = response.data
        hub = Hub.objects.get(name=data["name"])

        view = HubAddPendingMember.as_view()
        request = self.factory.put(f"/hubs/{hub.id}/request_join/")
        force_authenticate(request, user=user2)
        response = view(request, id=hub.id)

        data = response.data

        self.assertIn(user2, hub.pending_members.all())

 
    def test_hub_cancel_request_join(self):
        """
        Make sure user can cancel their request to join private hub 
        """
        dummy_hub = {"name" : "TEST HUB", "description" : "A HUB MADE IN TESTING", "private_hub": True}
        user = User.objects.create_user(username="Test HUB User", password="testpass")
        user2 = User.objects.create_user(username="Test HUB User 2", password="testpass")

        view = HubCreate.as_view()
        request = self.factory.post("/hubs/create/", dummy_hub, format="json")
        force_authenticate(request, user=user)
        response = view(request)

        data = response.data
        hub = Hub.objects.get(name=data["name"])

        view = HubAddPendingMember.as_view()
        request = self.factory.put(f"/hubs/{hub.id}/request_join/")
        force_authenticate(request, user=user2)
        response = view(request, id=hub.id)

        self.assertIn(user2, hub.pending_members.all())

        view = HubRemovePendingMember.as_view()
        request = self.factory.put(f"/hubs/{hub.id}/cancel_request_join/")
        force_authenticate(request, user=user2)
        response = view(request, id=hub.id)

        self.assertNotIn(user2, hub.pending_members.all())

    def test_hub_add_from_pending(self):
        """
        Make sure users can be added to hub from pending list
        """
        dummy_hub = {"name" : "TEST HUB", "description" : "A HUB MADE IN TESTING", "private_hub": True}
        user = User.objects.create_user(username="Test HUB User", password="testpass")
        user2 = User.objects.create_user(username="Test HUB User 2", password="testpass")
        user3 = User.objects.create_user(username="Test HUB User 3", password="testpass")
        user4 = User.objects.create_user(username="Test HUB User 4", password="testpass")

        view = HubCreate.as_view()
        request = self.factory.post("/hubs/create/", dummy_hub, format="json")
        force_authenticate(request, user=user)
        response = view(request)

        data = response.data
        hub = Hub.objects.get(name=data["name"])

        view = HubAddPendingMember.as_view()
        request = self.factory.put(f"/hubs/{hub.id}/request_join/")
        force_authenticate(request, user=user2)
        response = view(request, id=hub.id)

        self.assertIn(user2, hub.pending_members.all())

        view = HubAddMemberFromPending.as_view()
        request_data = {"user_id" : user2.id}
        request = self.factory.put(f"/hubs/{hub.id}/accept_join/", request_data, format="json")
        force_authenticate(request, user=user)
        response = view(request, id=hub.id)
        data = response.data

        self.assertIn(user2, hub.members.all())
        self.assertNotIn(user2, hub.pending_members.all())

        view = HubAddModerator.as_view()
        request_data = {"user_id": user2.id}
        request = self.factory.put(f"/hubs/{hub.id}/mods/add/", request_data, format="json")
        force_authenticate(request, user=user)
        response = view(request, id=hub.id)

        view = HubAddPendingMember.as_view()
        request = self.factory.put(f"/hubs/{hub.id}/request_join/")
        force_authenticate(request, user=user3)
        response = view(request, id=hub.id)

        self.assertIn(user3, hub.pending_members.all())

        view = HubAddMemberFromPending.as_view()
        request_data = {"user_id" : user3.id}
        request = self.factory.put(f"/hubs/{hub.id}/accept_join/", request_data, format="json")
        force_authenticate(request, user=user4)
        response = view(request, id=hub.id)
        data = response.data

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn(user3, hub.pending_members.all())

        view = HubAddMemberFromPending.as_view()
        request_data = {"user_id" : user3.id}
        request = self.factory.put(f"/hubs/{hub.id}/accept_join/", request_data, format="json")
        force_authenticate(request, user=user2)
        response = view(request, id=hub.id)
        data = response.data

        self.assertIn(user3, hub.members.all())
        self.assertNotIn(user3, hub.pending_members.all())

    def test_hub_remove_from_pending(self):
        """
        Make sure users can be removed from pending list
        """
        dummy_hub = {"name" : "TEST HUB", "description" : "A HUB MADE IN TESTING", "private_hub": True}
        user = User.objects.create_user(username="Test HUB User", password="testpass")
        user2 = User.objects.create_user(username="Test HUB User 2", password="testpass")
        user3 = User.objects.create_user(username="Test HUB User 3", password="testpass")

        view = HubCreate.as_view()
        request = self.factory.post("/hubs/create/", dummy_hub, format="json")
        force_authenticate(request, user=user)
        response = view(request)

        data = response.data
        hub = Hub.objects.get(name=data["name"])

        view = HubAddPendingMember.as_view()
        request = self.factory.put(f"/hubs/{hub.id}/request_join/")
        force_authenticate(request, user=user2)
        response = view(request, id=hub.id)

        self.assertIn(user2, hub.pending_members.all())

        view = HubAddMemberFromPending.as_view()
        request_data = {"user_id" : user2.id}
        request = self.factory.put(f"/hubs/{hub.id}/accept_join/", request_data, format="json")
        force_authenticate(request, user=user)
        response = view(request, id=hub.id)
        data = response.data

        self.assertIn(user2, hub.members.all())
        self.assertNotIn(user2, hub.pending_members.all())

        view = HubAddModerator.as_view()
        request_data = {"user_id": user2.id}
        request = self.factory.put(f"/hubs/{hub.id}/mods/add/", request_data, format="json")
        force_authenticate(request, user=user)
        response = view(request, id=hub.id)

        view = HubAddPendingMember.as_view()
        request = self.factory.put(f"/hubs/{hub.id}/request_join/")
        force_authenticate(request, user=user3)
        response = view(request, id=hub.id)

        self.assertIn(user3, hub.pending_members.all())

        view = HubRemoveMemberFromPending.as_view()
        request_data = {"user_id" : user3.id}
        request = self.factory.put(f"/hubs/{hub.id}/decline_join/", request_data, format="json")
        force_authenticate(request, user=user2)
        response = view(request, id=hub.id)
        data = response.data

        self.assertNotIn(user3, hub.pending_members.all())
        self.assertNotIn(user3, hub.members.all())

    def test_hub_kick(self):
        """
        Make sure owners can kick members of hub 
        """
        dummy_hub = {"name" : "TEST HUB", "description" : "A HUB MADE IN TESTING"}
        user = User.objects.create_user(username="Test HUB User", password="testpass")
        user2 = User.objects.create_user(username="Test HUB User 2", password="testpass")
        user3 = User.objects.create_user(username="Test HUB User 3", password="testpass")

        view = HubCreate.as_view()
        request = self.factory.post("/hubs/create/", dummy_hub, format="json")
        force_authenticate(request, user=user)
        response = view(request)

        data = response.data
        hub = Hub.objects.get(name=data["name"])

        view = HubAddMember.as_view() 
        request = self.factory.put(f"/hubs/{hub.id}/join/")
        force_authenticate(request, user=user2)
        response = view(request, id=hub.id)

        view = HubAddMember.as_view() 
        request = self.factory.put(f"/hubs/{hub.id}/join/")
        force_authenticate(request, user=user3)
        response = view(request, id=hub.id)

        view = HubAddModerator.as_view()
        request_data = {"user_id": user2.id}
        request = self.factory.put(f"/hubs/{hub.id}/mods/add/", request_data, format="json")
        force_authenticate(request, user=user)
        response = view(request, id=hub.id)

        self.assertEqual(hub.members.count(), 3)
        self.assertEqual(hub.mods.count(), 1)

        view = HubKickMember.as_view()
        request_data = {"user_id": user2.id}
        request = self.factory.put(f"/hubs/{hub.id}/kick/", request_data, format="json")
        force_authenticate(request, user=user)
        response = view(request, id=hub.id)

        view = HubKickMember.as_view()
        request_data = {"user_id": user3.id}
        request = self.factory.put(f"/hubs/{hub.id}/kick/", request_data, format="json")
        force_authenticate(request, user=user)
        response = view(request, id=hub.id)

        self.assertEqual(hub.members.count(), 1)
        self.assertEqual(hub.mods.count(), 0)

    def test_hub_kick(self):
        """
        Make sure bad kicks of hub not allowed 
        """
        dummy_hub = {"name" : "TEST HUB", "description" : "A HUB MADE IN TESTING"}
        user = User.objects.create_user(username="Test HUB User", password="testpass")
        user2 = User.objects.create_user(username="Test HUB User 2", password="testpass")
        user3 = User.objects.create_user(username="Test HUB User 3", password="testpass")

        view = HubCreate.as_view()
        request = self.factory.post("/hubs/create/", dummy_hub, format="json")
        force_authenticate(request, user=user)
        response = view(request)

        data = response.data
        hub = Hub.objects.get(name=data["name"])

        view = HubAddMember.as_view() 
        request = self.factory.put(f"/hubs/{hub.id}/join/")
        force_authenticate(request, user=user2)
        response = view(request, id=hub.id)

        view = HubAddMember.as_view() 
        request = self.factory.put(f"/hubs/{hub.id}/join/")
        force_authenticate(request, user=user3)
        response = view(request, id=hub.id)

        view = HubAddModerator.as_view()
        request_data = {"user_id": user2.id}
        request = self.factory.put(f"/hubs/{hub.id}/mods/add/", request_data, format="json")
        force_authenticate(request, user=user)
        response = view(request, id=hub.id)

        self.assertEqual(hub.members.count(), 3)
        self.assertEqual(hub.mods.count(), 1)

        view = HubKickMember.as_view()
        request_data = {"user_id": user3.id}
        request = self.factory.put(f"/hubs/{hub.id}/kick/", request_data, format="json")
        force_authenticate(request, user=user2)
        response = view(request, id=hub.id)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST) #mod cannot kick a user

        view = HubKickMember.as_view()
        request_data = {"user_id": user2.id}
        request = self.factory.put(f"/hubs/{hub.id}/kick/", request_data, format="json")
        force_authenticate(request, user=user3)
        response = view(request, id=hub.id)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST) #regular user cannot kick another user

        self.assertEqual(hub.members.count(), 3)
        self.assertEqual(hub.mods.count(), 1)
