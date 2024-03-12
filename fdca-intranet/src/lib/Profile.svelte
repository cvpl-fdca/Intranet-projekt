<div
	id="example-3"
	class="drawer bg-gray-800 text-white ring-2 ring-gray-700 ring-opacity-100 w-64 p-4 rounded-xl flex flex-col relative h-full"
>
	<!-- Drawer content here -->

	<!-- User Profile -->
	<div class="flex flex-col justify-between h-full pb-16">
		<!-- Add padding-bottom here -->
		<div class="text-center p-2">
			<!-- Text-center for centering content and removed flex classes -->
			<img
				src="lib/images/fdca_logo.svg"
				alt=""
				class="h-16 w-16 rounded-full mx-auto"
			/>
			<!-- mx-auto for centering image -->
			<div class="font-semibold my-4">Name: Anders ESP</div>
			<div class="font-semibold">mail@fdca.dk</div>
		</div>

		<!-- Menu Items -->
		<ul class="text-sm">
			<!-- Divider Line -->
			<hr class="my-2 border-t border-gray-600 h-px bg-gray-600 w-5/7 mx-auto" />
			<!-- Phone -->
			<li class="p-2 rounded-md font-semibold">Phone</li>
			<li class="hover:bg-gray-700 p-2 rounded-md font-semibold">+420 69696969</li>
			<li class="hover:bg-gray-700 p-2 rounded-md font-semibold">+360 720720720</li>
			<!-- Divider Line -->
			<hr class="my-2 border-t border-gray-600 h-px bg-gray-600 w-5/7 mx-auto" />
			<!-- Mail -->
			<li class="p-2 rounded-md font-semibold">Emails</li>
			<li class="hover:bg-gray-700 p-2 rounded-md font-semibold">mail@gmail.com</li>
			<li class="hover:bg-gray-700 p-2 rounded-md font-semibold">mail@mango.dk</li>
			<!-- Divider Line -->
			<hr class="my-2 border-t border-gray-600 h-px bg-gray-600 w-5/7 mx-auto" />
			<!-- Menu Items -->
			<li class="p-2 rounded-md font-semibold">Discord User</li>
			<li class="hover:bg-gray-700 p-2 rounded-md font-semibold">Anders#6969</li>
			<!-- Divider Line -->
			<hr class="my-2 border-t border-gray-600 h-px bg-gray-600 w-5/7 mx-auto" />
		</ul>
	</div>

	<!-- Buttons -->
	<div class="absolute bottom-2.5 left-1 right-1 p-2 flex justify-between">
		<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
			Edit
		</button>
		<button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
			Logout
		</button>
	</div>
</div>
